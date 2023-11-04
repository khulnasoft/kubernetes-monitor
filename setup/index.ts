import * as fs from 'fs';
import { randomUUID } from 'crypto';
import sleep from 'sleep-promise';

import platforms, { getKubernetesVersionForPlatform } from './platforms';
import deployers from './deployers';
import { IDeployOptions, IImageOptions } from './deployers/types';
import * as kubectl from '../helpers/kubectl';
import { execWrapper as exec } from '../helpers/exec';

const testPlatform = process.env['TEST_PLATFORM'] || 'kind';
const createCluster = process.env['CREATE_CLUSTER'] === 'true';
const deploymentType = process.env['DEPLOYMENT_TYPE'] || 'YAML';

function getIntegrationId(): string {
  const integrationId = process.env.INTEGRATION_TESTS_INTEGRATION_ID!;
  console.log(`using integration ID ${integrationId} for integration tests`);
  return integrationId;
}

function getClusterName(): string {
  const clusterName = `cluster_${randomUUID()}`;
  console.log(`Generated new Cluster Name ${clusterName}`);
  return clusterName;
}

function getServiceAccountApiToken(): string {
  const serviceAccountApiToken =
    process.env.INTEGRATION_TESTS_SERVICE_ACCOUNT_API_TOKEN!;
  return serviceAccountApiToken;
}

function getEnvVariableOrDefault(
  envVarName: string,
  defaultValue: string,
): string {
  const value = process.env[envVarName];
  return value === undefined || value === '' ? defaultValue : value;
}

export function khulnasoftMonitorNamespace(): string {
  let namespace = 'khulnasoft-monitor';
  if (testPlatform === 'kindolm') {
    namespace = 'marketplace';
  }

  return namespace;
}

export async function removeMonitor(): Promise<void> {
  // Credentials may have expired on certain platforms (OpenShift 4), try to regenerate them.
  await platforms[testPlatform].config().catch(() => undefined);
  await dumpLogs().catch(() => undefined);

  try {
    if (createCluster) {
      await platforms[testPlatform].delete();
    } else {
      await platforms[testPlatform].clean();
    }
  } catch (error: any) {
    console.log(`Could not remove the Kubernetes-Monitor: ${error.message}`);
  }
}

export async function removeLocalContainerRegistry(): Promise<void> {
  try {
    await exec('docker rm kind-registry --force');
  } catch (error: any) {
    console.log(
      `Could not remove container registry, it probably did not exist: ${error.message}`,
    );
  }
}

export async function removeUnusedKindNetwork(): Promise<void> {
  try {
    await exec('docker network rm kind');
  } catch (error: any) {
    console.log(`Could not remove "kind" network: ${error.message}`);
  }
}

async function createEnvironment(): Promise<void> {
  await kubectl.createNamespace('services');
  // Small hack to prevent timing problems in CircleCI...
  // TODO: should be replaced by actively waiting for the namespace to be created
  await sleep(5000);
}

async function predeploy(
  integrationId: string,
  serviceAccountApiToken: string,
  namespace: string,
): Promise<void> {
  try {
    const secretName = 'khulnasoft-monitor';
    console.log(`Creating namespace ${namespace} and secret ${secretName}`);

    try {
      await kubectl.createNamespace(namespace);
    } catch (error) {
      console.log(`Namespace ${namespace} already exist`);
    }
    const gcrDockercfg = process.env['PRIVATE_REGISTRIES_DOCKERCFG'] || '{}';
    await kubectl.createSecret(secretName, namespace, {
      'dockercfg.json': gcrDockercfg,
      integrationId,
      serviceAccountApiToken,
    });
    await createRegistriesConfigMap(namespace);
    console.log(`Namespace ${namespace} and secret ${secretName} created`);
  } catch (error) {
    console.log(
      'Could not create namespace and secret, they probably already exist',
    );
  }
}

/** This is used in order to avoid Docker Hub rate limiting on our integration tests. */
async function createSecretForDockerHubAccess(): Promise<void> {
  const secretName = 'docker-io';
  const secretsKeyPrefix = '--';
  const secretType = 'docker-registry';
  await kubectl.createSecret(
    secretName,
    'services',
    {
      'docker-server': 'https://docker.io',
      'docker-username': getEnvVariableOrDefault('DOCKER_HUB_RO_USERNAME', ''),
      'docker-email': 'runtime@khulnasoft.com',
      'docker-password': getEnvVariableOrDefault('DOCKER_HUB_RO_PASSWORD', ''),
    },
    secretsKeyPrefix,
    secretType,
  );
}

async function createSecretForGcrIoAccess(): Promise<void> {
  const gcrSecretName = 'gcr-io';
  const gcrKubectlSecretsKeyPrefix = '--';
  const gcrSecretType = 'docker-registry';
  const gcrToken = getEnvVariableOrDefault('GCR_IO_SERVICE_ACCOUNT', '{}');
  await kubectl.createSecret(
    gcrSecretName,
    'services',
    {
      'docker-server': 'https://gcr.io',
      'docker-username': '_json_key',
      'docker-email': 'egg@khulnasoft.com',
      'docker-password': gcrToken,
    },
    gcrKubectlSecretsKeyPrefix,
    gcrSecretType,
  );
}

async function createRegistriesConfigMap(namespace): Promise<void> {
  await kubectl.createConfigMap(
    'khulnasoft-monitor-registries-conf',
    namespace,
    './test/fixtures/insecure-registries/registries.conf',
  );
}

export async function deployMonitor(): Promise<{
  integrationId: string;
  clusterName: string;
}> {
  console.log('Begin deploying the khulnasoft-monitor...');
  const namespace = khulnasoftMonitorNamespace();
  try {
    await platforms[testPlatform].validateRequiredEnvironment();

    const imageNameAndTag = getEnvVariableOrDefault(
      'KUBERNETES_MONITOR_IMAGE_NAME_AND_TAG',
      // the default, determined by ./script/build-image.sh
      'khulnasoft/kubernetes-monitor:local',
    );

    console.log(
      `platform chosen is ${testPlatform}, createCluster===${createCluster}`,
    );

    const kubernetesVersion = getKubernetesVersionForPlatform(testPlatform);
    await kubectl.downloadKubectl(kubernetesVersion);

    await platforms[testPlatform].setupTester();
    if (createCluster) {
      await platforms[testPlatform].create(kubernetesVersion);
      await platforms[testPlatform].config();
    } else {
      await platforms[testPlatform].config();
      await platforms[testPlatform].clean();
    }
    const remoteImageName = await platforms[testPlatform].loadImage(
      imageNameAndTag,
    );
    await createEnvironment();
    await createSecretForGcrIoAccess();
    await createSecretForDockerHubAccess();

    const integrationId = getIntegrationId();
    const serviceAccountApiToken = getServiceAccountApiToken();
    await predeploy(integrationId, serviceAccountApiToken, namespace);

    // TODO: hack, rewrite this
    const imagePullPolicy =
      testPlatform === 'kind' || testPlatform === 'kindolm'
        ? 'Never'
        : 'Always';
    const deploymentImageOptions: IImageOptions = {
      nameAndTag: remoteImageName,
      pullPolicy: imagePullPolicy,
    };
    const clusterName = getClusterName();
    const deploymentOptions: IDeployOptions = {
      clusterName: clusterName,
    };

    await deployers[deploymentType].deploy(
      deploymentImageOptions,
      deploymentOptions,
    );
    for (let attempt = 0; attempt < 180; attempt++) {
      try {
        await exec(
          `./kubectl get deployment.apps/khulnasoft-monitor -n ${namespace}`,
        );
        break;
      } catch {
        await sleep(1000);
      }
    }

    console.log(
      `Deployed the khulnasoft-monitor with integration ID: ${integrationId}, in cluster name: ${clusterName}`,
    );
    return { integrationId, clusterName };
  } catch (err) {
    console.error(err);
    try {
      await removeMonitor();
    } catch (error) {
      // ignore cleanup errors
    } finally {
      // ... but make sure the test suite doesn't proceed if the setup failed
      process.exit(-1);
    }
  }
}

async function dumpLogs(): Promise<void> {
  const logDir = `/tmp/logs/test/integration/${testPlatform}`;
  if (!fs.existsSync(logDir)) {
    console.log('not dumping logs because', logDir, 'does not exist');
    return;
  }

  const podNames = await kubectl.getPodNames('khulnasoft-monitor').catch(() => []);
  const khulnasoftMonitorPod = podNames.find((name) =>
    name.startsWith('khulnasoft-monitor'),
  );
  if (khulnasoftMonitorPod === undefined) {
    console.log('not dumping logs because khulnasoft-monitor pod does not exist');
    return;
  }

  const logs = await kubectl.getPodLogs(khulnasoftMonitorPod, 'khulnasoft-monitor');
  const logPath = `${logDir}/kubernetes-monitor.log`;
  console.log('dumping logs to', logPath);
  fs.writeFileSync(logPath, logs);
}

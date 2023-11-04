import { chmodSync, writeFileSync, existsSync } from 'fs';
import { platform, tmpdir } from 'os';
import { resolve } from 'path';
import needle from 'needle';

import { throwIfEnvironmentVariableUnset } from './helpers';
import * as kubectl from '../../helpers/kubectl';
import { execWrapper as exec } from '../../helpers/exec';

const OPENSHIFT_CLI_VERSION = '4.7.0';

export async function validateRequiredEnvironment(): Promise<void> {
  console.log(
    'Checking for the required environment variables: OPENSHIFT4_USER, OPENSHIFT4_PASSWORD, OPENSHIFT4_CLUSTER_URL, DOCKER_HUB_RO_USERNAME, DOCKER_HUB_RO_PASSWORD',
  );
  throwIfEnvironmentVariableUnset('OPENSHIFT4_USER');
  throwIfEnvironmentVariableUnset('OPENSHIFT4_PASSWORD');
  throwIfEnvironmentVariableUnset('OPENSHIFT4_CLUSTER_URL');
  throwIfEnvironmentVariableUnset('DOCKER_HUB_RO_USERNAME');
  throwIfEnvironmentVariableUnset('DOCKER_HUB_RO_PASSWORD');
}

export async function setupTester(): Promise<void> {
  if (existsSync(resolve(process.cwd(), 'oc'))) {
    console.log('OpenShift CLI exists locally, skipping download');
    return;
  }

  const nodeJsPlatform = platform();
  const downloadUrl = getDownloadUrlForOpenShiftCli(
    nodeJsPlatform,
    OPENSHIFT_CLI_VERSION,
  );
  console.log('Downloading OpenShift CLI...');
  const response = await needle('get', downloadUrl, { follow_max: 5 });
  await extractOpenShiftCli(response.body);
  console.log('Downloaded OpenShift CLI!');
}

export async function returnUnchangedImageNameAndTag(
  imageNameAndTag: string,
): Promise<string> {
  // For OpenShift, the image name requires no pre-processing or loading into a cluster, hence we don't modify it.
  return imageNameAndTag;
}

export async function createCluster(): Promise<void> {
  throw new Error('Not implemented');
}

export async function deleteCluster(): Promise<void> {
  throw new Error('Not implemented');
}

export async function exportKubeConfig(): Promise<void> {
  const user = process.env['OPENSHIFT4_USER'];
  const userPassword = process.env['OPENSHIFT4_PASSWORD'];
  const clusterURL = process.env['OPENSHIFT4_CLUSTER_URL'];
  const tmp = tmpdir();
  const kubeconfigPath = `${tmp}/kubeconfig`;
  const cmd = // Local vs remote testing
    clusterURL === 'https://api.crc.testing:6443'
      ? // TODO(ivanstanev): pin to a specific CA certificate
        `./oc login -u "${user}" -p "${userPassword}" "${clusterURL}" --insecure-skip-tls-verify=true --kubeconfig ${kubeconfigPath}`
      : `./oc login --token="${userPassword}" "${clusterURL}" --kubeconfig ${kubeconfigPath}`;
  const result = await exec(cmd);

  console.log('oc login result:', result.stderr || result.stdout);

  process.env.KUBECONFIG = kubeconfigPath;
}

async function tryDescribingResourceToFile(
  kind: string,
  name: string,
  namespace: string,
): Promise<void> {
  try {
    const description = await kubectl.describeKubernetesResource(
      kind,
      name,
      namespace,
    );
    const fileName = `${kind}-${name}-${namespace}`;
    const filePath = process.env.CI
      ? // The directory is generated by CircleCI config (see .circleci/config.yml).
        `/tmp/logs/test/integration/openshift4/${fileName}`
      : `${tmpdir()}/${fileName}`;
    writeFileSync(filePath, description);
    console.log(`Description for ${kind} ${name} is stored in ${filePath}`);
  } catch (error) {
    console.log(
      `Could not describe ${kind} ${name} in namespace ${namespace}`,
      { error },
    );
  }
}

export async function clean(): Promise<void> {
  await Promise.all([
    tryDescribingResourceToFile('deployment', 'khulnasoft-operator', 'khulnasoft-monitor'),
    tryDescribingResourceToFile('deployment', 'khulnasoft-monitor', 'khulnasoft-monitor'),
    tryDescribingResourceToFile(
      'catalogsource',
      'khulnasoft-operator',
      'openshift-marketplace',
    ),
    tryDescribingResourceToFile(
      'subscription',
      'khulnasoft-operator',
      'khulnasoft-monitor',
    ),
  ]);

  // Kubernetes will be stuck trying to delete these resources if we don't clear the finalizers.
  await Promise.all([
    kubectl
      .patchResourceFinalizers(
        'customresourcedefinition',
        'khulnasoftmonitors.charts.helm.k8s.io',
        'khulnasoft-monitor',
      )
      .catch(() => undefined),
    kubectl
      .patchResourceFinalizers(
        'khulnasoftmonitors.charts.helm.k8s.io',
        'khulnasoft-monitor',
        'khulnasoft-monitor',
      )
      .catch(() => undefined),
  ]);

  // Remove resources
  await Promise.all([
    kubectl
      .deleteResource(
        'customresourcedefinition',
        'khulnasoftmonitors.charts.helm.k8s.io',
        'default',
      )
      .catch(() => undefined),
    kubectl
      .deleteResource('catalogsource', 'khulnasoft-operator', 'openshift-marketplace')
      .catch(() => undefined),
    kubectl
      .deleteResource('clusterrolebinding', 'khulnasoft-monitor', 'default')
      .catch(() => undefined),
    kubectl
      .deleteResource('clusterrole', 'khulnasoft-monitor', 'default')
      .catch(() => undefined),
    kubectl
      .deleteResource('--all', 'all,sa,cm,secret,pvc,rollouts', 'services')
      .catch(() => undefined),
    kubectl
      .deleteResource('--all', 'all,sa,cm,secret,pvc,rollouts', 'argo-rollouts')
      .catch(() => undefined),
    kubectl
      .deleteResource(
        '--all',
        'all,sa,cm,secret,pvc,subscription,installplan,csv',
        'khulnasoft-monitor',
      )
      .catch(() => undefined),
  ]);

  // Kubernetes will be stuck trying to delete these namespaces if we don't clear the finalizers.
  await Promise.all([
    kubectl.patchNamespaceFinalizers('services').catch(() => undefined),
    kubectl.patchNamespaceFinalizers('argo-rollouts').catch(() => undefined),
    kubectl.patchNamespaceFinalizers('khulnasoft-monitor').catch(() => undefined),
  ]);
  // Remove namespaces
  await Promise.all([
    kubectl.deleteNamespace('services').catch(() => undefined),
    kubectl.deleteNamespace('argo-rollouts').catch(() => undefined),
    kubectl.deleteNamespace('khulnasoft-monitor').catch(() => undefined),
  ]);
}

async function extractOpenShiftCli(responseBody: any): Promise<void> {
  const tmp = tmpdir();
  const temporaryTarLocation = `${tmp}/openshift-cli`;
  writeFileSync(temporaryTarLocation, responseBody);

  const currentLocation = process.cwd();
  await exec(`tar -C ${currentLocation} -xzvf ${temporaryTarLocation} oc`);

  const openShiftCliLocation = resolve(currentLocation, 'oc');
  chmodSync(openShiftCliLocation, 0o755); // rwxr-xr-x
}

function getDownloadUrlForOpenShiftCli(
  nodeJsPlatform: string,
  cliVersion: string,
): string {
  const normalisedPlatform =
    nodeJsPlatform === 'darwin' ? 'mac' : nodeJsPlatform;
  return `https://mirror.openshift.com/pub/openshift-v4/clients/ocp/${cliVersion}/openshift-client-${normalisedPlatform}-${cliVersion}.tar.gz`;
}

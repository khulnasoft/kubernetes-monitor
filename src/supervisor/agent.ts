import { config } from '../common/config';
import { logger } from '../common/logger';
import { k8sApi } from './cluster';
import { retryKubernetesApiRequestIndefinitely } from './kuberenetes-api-wrappers';

export async function setKhulnasoftMonitorAgentId(): Promise<void> {
  const name = config.DEPLOYMENT_NAME;
  const namespace = config.DEPLOYMENT_NAMESPACE;

  const agentId = await getKhulnasoftMonitorDeploymentUid(name, namespace);
  if (agentId === undefined) {
    return;
  }

  config.AGENT_ID = agentId;
}

async function getKhulnasoftMonitorDeploymentUid(
  name: string,
  namespace: string,
): Promise<string | undefined> {
  try {
    const attemptedApiCall = await retryKubernetesApiRequestIndefinitely(
      () => k8sApi.appsClient.readNamespacedDeployment(name, namespace),
      config.MAX_RETRY_BACKOFF_DURATION_SECONDS,
    );
    return attemptedApiCall.body.metadata?.uid;
  } catch (error) {
    logger.error(
      { error, namespace, deploymentName: name },
      'could not read the khulnasoft-monitor deployment unique id',
    );
    return undefined;
  }
}

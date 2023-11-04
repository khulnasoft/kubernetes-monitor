import { KubeConfig } from '@kubernetes/client-node';
import { config } from '../common/config';
import { IK8sClients, K8sClients } from './types';

function getKubeConfig(): KubeConfig {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  return kc;
}

// Gets the cluster name, passed as a config variable inside the app.
function getCurrentCluster(): string {
  return config.CLUSTER_NAME;
}

function getK8sApi(k8sConfig: KubeConfig): IK8sClients {
  return new K8sClients(k8sConfig);
}

export const kubeConfig = getKubeConfig();
export const currentClusterName = getCurrentCluster();
export const k8sApi = getK8sApi(kubeConfig);

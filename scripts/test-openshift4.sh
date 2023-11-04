#! /bin/bash
set -eo pipefail

function validateEnvVar {
  var_name="$1"
  var_value="$2"
  if [[ "$var_value" == "" ]]; then
    echo "Missing environment variable $var_name"
    exit 1
  fi
}

validateEnvVar DOCKERHUB_USER "$DOCKERHUB_USER"
validateEnvVar DOCKERHUB_PASSWORD "$DOCKERHUB_PASSWORD"
validateEnvVar OPENSHIFT4_USER "$OPENSHIFT4_USER"
validateEnvVar OPENSHIFT4_PASSWORD "$OPENSHIFT4_PASSWORD"
validateEnvVar OPENSHIFT4_CLUSTER_URL "$OPENSHIFT4_CLUSTER_URL"

if [ "${CI}" != "true" ]; then
  if [ "$KUBERNETES_MONITOR_IMAGE_TAG" == "" ]; then
    RED_COLOR='\033[0;31m'
    NO_COLOR='\033[0m'
    echo "-----------------------------------"
    echo -e "${RED_COLOR}"
    echo "WARNING! WARNING! WARNING! WARNING!"
    echo -e "${NO_COLOR}"
    echo "You have not set the KUBERNETES_MONITOR_IMAGE_TAG environment variable."
    echo "This will cause the script to build the whole kubernetes-monitor Docker image, which is slow!"
    echo "Exit the script now or wait to continue..."
    echo "-----------------------------------"
    sleep 10
  fi
  
  # Check if we're testing against a local OpenShift cluster
  if [ "${OPENSHIFT4_CLUSTER_URL}" == "https://api.crc.testing:6443" ]; then
    # no-op if already started:
    crc start
    oc login -u "${OPENSHIFT4_USER}" -p "${OPENSHIFT4_PASSWORD}" "${OPENSHIFT4_CLUSTER_URL}" --insecure-skip-tls-verify=true
  else
    oc login --token="${OPENSHIFT4_PASSWORD}" --server="${OPENSHIFT4_CLUSTER_URL}"
  fi 
  
  python3 scripts/operator/main.py
fi

DEPLOYMENT_TYPE=OperatorOS TEST_PLATFORM=openshift4 CREATE_CLUSTER=false jest --logHeapUsage --ci --maxWorkers=1 test/integration/kubernetes.spec.ts
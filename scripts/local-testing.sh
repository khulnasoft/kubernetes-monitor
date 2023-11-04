#! /bin/bash

get_latest_release() {
    curl --silent "https://api.github.com/repos/$1/releases/latest" | # Get latest release from GitHub api
    grep '"tag_name":' |                                            # Get tag line
    sed -E 's/.*"([^"]+)".*/\1/' |                                  # Pluck JSON value
    sed 's/v//'                                                     # Remove "v" prefix
}

LATEST_TAG=$(get_latest_release khulnasoft/kubernetes-monitor)
IP=$(ifconfig | grep "inet " | grep -Fv 127.0.0.1 | awk 'NR==1{print $2}')

if [ "$INTEGRATION_ID" == "" ]; then
    echo "Enter your integration ID: "
    read INTEGRATION_ID
fi

if [ "$SERVICE_ACCOUNT_API_TOKEN" == "" ]; then
    echo "Enter your service account API token: "
    read SERVICE_ACCOUNT_API_TOKEN
fi

kind delete cluster
kind create cluster
kubectl create namespace khulnasoft-monitor
kubectl create secret generic khulnasoft-monitor -n khulnasoft-monitor --from-literal=dockercfg.json={} --from-literal=integrationId=${INTEGRATION_ID} --from-literal=serviceAccountApiToken=${SERVICE_ACCOUNT_API_TOKEN}
helm upgrade --install khulnasoft-monitor ./khulnasoft-monitor --namespace khulnasoft-monitor --set clusterName="kind localhost" --set image.tag=${LATEST_TAG} --set integrationApi=http://${IP}:9000

printf "\r\n\r\nYou can now check if the pod is running using:\r\n\tkubectl get pod -n khulnasoft-monitor\r\n"
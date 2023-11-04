FROM quay.io/operator-framework/helm-operator:v1.28

LABEL name="Khulnasoft Operator" \
      maintainer="support@khulnasoft.com" \
      vendor="Khulnasoft Ltd" \
      summary="Khulnasoft Operator for Khulnasoft Controller" \
      description="Khulnasoft Controller enables you to import and test your running workloads and identify vulnerabilities in their associated images and configurations that might make those workloads less secure."

ENV HOME=/opt/helm

COPY LICENSE /licenses/LICENSE
COPY watches.yaml ${HOME}/watches.yaml
COPY helm-charts/ ${HOME}/helm-charts/

WORKDIR ${HOME}
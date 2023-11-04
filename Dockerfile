#---------------------------------------------------------------------
# STAGE 1: Build credential helpers inside a temporary container
#---------------------------------------------------------------------
FROM golang:alpine AS cred-helpers-build

RUN apk update
RUN apk upgrade
RUN apk --no-cache add git

RUN go install github.com/awslabs/amazon-ecr-credential-helper/ecr-login/cli/docker-credential-ecr-login@69c85dc22db6511932bbf119e1a0cc5c90c69a7f
RUN go install github.com/chrismellard/docker-credential-acr-env@82a0ddb2758901b711d9d1614755b77e401598a1

#---------------------------------------------------------------------
# STAGE 2: Build the kubernetes-monitor
#---------------------------------------------------------------------
FROM node:gallium-alpine

LABEL name="khulnasoft Controller" \
      maintainer="support@khulnasoft.com" \
      vendor="khulnasoft Ltd" \
      summary="khulnasoft integration for Kubernetes" \
      description="khulnasoft Controller enables you to import and test your running workloads and identify vulnerabilities in their associated images and configurations that might make those workloads less secure."

COPY LICENSE /licenses/LICENSE

ENV NODE_ENV production

RUN apk update
RUN apk upgrade
RUN apk --no-cache add dumb-init skopeo curl bash python3

RUN addgroup -S -g 10001 khulnasoft
RUN adduser -S -G khulnasoft -h /srv/app -u 10001 khulnasoft

# Install gcloud
RUN curl -sL https://sdk.cloud.google.com > /install.sh
RUN bash /install.sh --disable-prompts --install-dir=/ && rm /google-cloud-sdk/bin/anthoscli && rm -rf /google-cloud-sdk/platform
ENV PATH=/google-cloud-sdk/bin:$PATH
RUN rm /install.sh
RUN apk del curl bash

# Copy credential helpers
COPY --chown=khulnasoft:khulnasoft --from=cred-helpers-build /go/bin/docker-credential-ecr-login /usr/bin/docker-credential-ecr-login
COPY --chown=khulnasoft:khulnasoft --from=cred-helpers-build /go/bin/docker-credential-acr-env /usr/bin/docker-credential-acr-env

WORKDIR /srv/app
USER 10001:10001

# Add manifest files and install before adding anything else to take advantage of layer caching
ADD --chown=khulnasoft:khulnasoft package.json package-lock.json ./

# The `.config` directory is used by `khulnasoft protect` and we also mount a K8s volume there at runtime.
# This clashes with OpenShift 3 which mounts things differently and prevents access to the directory.
# TODO: Remove this line once OpenShift 3 comes out of support.
RUN mkdir -p .config

RUN npm ci

# add the rest of the app files
ADD --chown=khulnasoft:khulnasoft . .

# OpenShift 4 doesn't allow dumb-init access the app folder without this permission.
RUN chmod 755 /srv/app && chmod 755 /srv/app/bin && chmod +x /srv/app/bin/start

# This must be in the end for Red Hat Build Service
RUN chown -R khulnasoft:khulnasoft .
USER 10001:10001

# Build typescript
RUN npm run build

ENTRYPOINT ["/usr/bin/dumb-init", "--", "bin/start"]
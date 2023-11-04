{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "khulnasoft-monitor.name" -}}
{{- default .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Provides a value used as a hint by the khulnasoft-monitor to determine
if the monitor should watch all namespaces in the cluster or just a single namespace.
If the monitor is scoped to a namespace, it is the same one as the deployment.
*/}}
{{- define "khulnasoft-monitor.scope" -}}
{{- if contains .Values.scope "Cluster" -}}
{{- printf "" -}}
{{- else -}}
{{- printf "%s" .Release.Namespace -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "khulnasoft-monitor.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

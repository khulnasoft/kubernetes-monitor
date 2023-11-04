import {
  IWorkloadLocator,
  IWorkloadMetadata,
} from '../../src/transmitter/types';

export type DepGraphsValidator = (depGraphs?: {
  [name: string]: object;
}) => boolean;

export type WorkloadLocatorValidator = (
  workloads: IWorkloadLocator[] | undefined,
) => boolean;

export type WorkloadMetadataValidator = (
  workloadInfo: IWorkloadMetadata | undefined,
) => boolean;

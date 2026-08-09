/*
 * Friendly, strongly-typed domain models used throughout the UI. These sit on
 * top of the generated Dataverse models (src/generated) and hide the raw
 * `crb32_*` attribute names and `@odata.bind` plumbing from components.
 */

export interface CaseRecord {
  id: string;
  claimant: string;
  defendant: string;
  responsibleId: string;
  responsibleName: string;
  secondResponsibleId?: string;
  secondResponsibleName?: string;
  caseType?: number;
  caseTypeLabel?: string;
  currentStageId?: string;
  currentStageLabel?: string;
  description?: string;
  link?: string;
  createdOn?: string;
}

export interface CaseFormValues {
  claimant: string;
  defendant: string;
  responsibleId?: string;
  secondResponsibleId?: string;
  caseType?: number;
  description: string;
}

export interface StageRecord {
  id: string;
  caseId: string;
  number?: number;
  stageYear?: number;
  claimantName?: string;
  defendantName?: string;
  jungleDistrict?: number;
  stageName?: number;
  stageNameLabel?: string;
  description?: string;
  autoNum?: string;
  createdOn?: string;
}

export interface StageFormValues {
  number?: number;
  stageYear?: number;
  claimantName: string;
  defendantName: string;
  jungleDistrict?: number;
  stageName?: number;
  description: string;
}

export interface UpdateRecord {
  id: string;
  caseId: string;
  stageId?: string;
  stageLabel?: string;
  updateType?: number;
  updateTypeLabel?: string;
  currentDate?: string;
  date?: string;
  documentsProvided?: string;
  description?: string;
}

export interface UpdateFormValues {
  stageId?: string;
  updateType?: number;
  date?: string;
  documentsProvided: string;
  description: string;
}

export interface UserOption {
  id: string;
  fullName: string;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/*
 * Conversion helpers between the generated Dataverse models and the friendly
 * domain models. Also builds the create/update payloads (including
 * `@odata.bind` lookup bindings) sent back to the generated services.
 */
import type { Crb32_caseses, Crb32_casesesBase } from '../generated/models/Crb32_casesesModel';
import type { Crb32_stageses, Crb32_stagesesBase } from '../generated/models/Crb32_stagesesModel';
import type { Crb32_updateses, Crb32_updatesesBase } from '../generated/models/Crb32_updatesesModel';
import { labelForOption, CASE_TYPE_OPTIONS, STAGE_NAME_OPTIONS, UPDATE_TYPE_OPTIONS } from './choices';
import type { CaseFormValues, CaseRecord, StageFormValues, StageRecord, UpdateFormValues, UpdateRecord } from './domain';

// Entity set names (must match power.config.json databaseReferences).
const CASES_SET = 'crb32_caseses';
const STAGES_SET = 'crb32_stageses';
const SYSTEMUSERS_SET = 'systemusers';

const bind = (entitySet: string, id: string) => `/${entitySet}(${id})`;

// ---------- Case ----------

export function toCaseRecord(row: Crb32_caseses): CaseRecord {
  return {
    id: row.crb32_casesid,
    caseNumber: row.crb32_newcolumn,
    claimant: row.crb32_from ?? '',
    defendant: row.crb32_to ?? '',
    responsibleId: row._crb32_responsible_value ?? '',
    responsibleName: row.crb32_responsiblename ?? '',
    secondResponsibleId: row._crb32_secondresponsible_value,
    secondResponsibleName: row.crb32_secondresponsiblename,
    caseType: row.crb32_ty,
    caseTypeLabel: row.crb32_tyname ?? labelForOption(CASE_TYPE_OPTIONS, row.crb32_ty),
    currentStageId: row._crb32_currentstage_value,
    currentStageLabel: row.crb32_currentstagename,
    description: row.crb32_description,
    link: row.crb32_link,
    createdOn: row.createdon,
  };
}

/**
 * `crb32_cases` has no server-computed name columns for its user lookups, so
 * Responsible / Second Responsible display names are resolved client-side
 * against a systemuserid -> fullname map (see hooks/userDirectory.ts).
 */
export function withResolvedResponsibleNames(record: CaseRecord, userDirectory: Map<string, string>): CaseRecord {
  return {
    ...record,
    responsibleName: record.responsibleName || (record.responsibleId ? userDirectory.get(record.responsibleId) ?? '' : ''),
    secondResponsibleName:
      record.secondResponsibleName || (record.secondResponsibleId ? userDirectory.get(record.secondResponsibleId) : undefined),
  };
}

/** Same idea as {@link withResolvedResponsibleNames}, for the Current Stage lookup. */
export function withResolvedCurrentStageName(record: CaseRecord, stageDirectory: Map<string, string>): CaseRecord {
  return {
    ...record,
    currentStageLabel: record.currentStageLabel || (record.currentStageId ? stageDirectory.get(record.currentStageId) : undefined),
  };
}

export function buildCaseCreatePayload(values: CaseFormValues): Omit<Crb32_casesesBase, 'crb32_casesid'> {
  if (!values.responsibleId) {
    throw new Error('Responsible is required.');
  }
  const payload: Omit<Crb32_casesesBase, 'crb32_casesid'> = {
    crb32_from: values.claimant,
    crb32_to: values.defendant,
    crb32_description: values.description || undefined,
    crb32_ty: values.caseType as Crb32_casesesBase['crb32_ty'],
    statecode: 0,
    'crb32_Responsible@odata.bind': bind(SYSTEMUSERS_SET, values.responsibleId),
  };
  if (values.secondResponsibleId) {
    payload['crb32_SecondResponsible@odata.bind'] = bind(SYSTEMUSERS_SET, values.secondResponsibleId);
  }
  return payload;
}

export function buildCaseUpdatePayload(values: CaseFormValues): Partial<Omit<Crb32_casesesBase, 'crb32_casesid'>> {
  const payload: Partial<Omit<Crb32_casesesBase, 'crb32_casesid'>> = {
    crb32_from: values.claimant,
    crb32_to: values.defendant,
    crb32_description: values.description || undefined,
    crb32_ty: values.caseType as Crb32_casesesBase['crb32_ty'],
  };
  if (values.responsibleId) {
    payload['crb32_Responsible@odata.bind'] = bind(SYSTEMUSERS_SET, values.responsibleId);
  }
  payload['crb32_SecondResponsible@odata.bind'] = values.secondResponsibleId
    ? bind(SYSTEMUSERS_SET, values.secondResponsibleId)
    : undefined;
  return payload;
}

export function buildCaseLinkPayload(caseId: string, appOrigin: string): Partial<Omit<Crb32_casesesBase, 'crb32_casesid'>> {
  return {
    crb32_link: `${appOrigin}#/cases/${caseId}`,
  };
}

export function buildCaseCurrentStagePayload(stageId: string): Partial<Omit<Crb32_casesesBase, 'crb32_casesid'>> {
  return {
    'crb32_CurrentStage@odata.bind': bind(STAGES_SET, stageId),
  };
}

// ---------- Stage ----------

export function toStageRecord(row: Crb32_stageses): StageRecord {
  return {
    id: row.crb32_stagesid,
    caseId: row._crb32_case_value ?? '',
    number: row.crb32_number,
    stageYear: row.crb32_stageyear,
    claimantName: row.crb32_claimanttext,
    defendantName: row.crb32_defendanttext,
    jungleDistrict: row.crb32_jungledistrict,
    stageName: row.crb32_stagename ? Number(row.crb32_stagename) : undefined,
    stageNameLabel: row.crb32_stagenamename ?? labelForOption(STAGE_NAME_OPTIONS, row.crb32_stagename ? Number(row.crb32_stagename) : undefined),
    description: row.crb32_description,
    autoNum: row.crb32_autonum,
    createdOn: row.createdon,
  };
}

function stagePrimaryName(values: StageFormValues): string {
  const label = labelForOption(STAGE_NAME_OPTIONS, values.stageName) || 'Stage';
  const num = values.number ? ` #${values.number}` : '';
  const year = values.stageYear ? ` (${values.stageYear})` : '';
  return `${label}${num}${year}`;
}

/** Human-friendly label for a stage, e.g. "Appeal #2 (2025)". Used wherever a stage needs to be shown by name. */
export function formatStageLabel(stage: Pick<StageRecord, 'stageNameLabel' | 'stageName' | 'number' | 'stageYear'>): string {
  const label = stage.stageNameLabel || labelForOption(STAGE_NAME_OPTIONS, stage.stageName) || 'Stage';
  const num = stage.number ? ` #${stage.number}` : '';
  const year = stage.stageYear ? ` (${stage.stageYear})` : '';
  return `${label}${num}${year}`;
}

export function buildStageCreatePayload(
  caseId: string,
  values: StageFormValues
): Omit<Crb32_stagesesBase, 'crb32_stagesid'> {
  return {
    'crb32_Case@odata.bind': bind(CASES_SET, caseId),
    crb32_newcolumn: stagePrimaryName(values),
    crb32_number: values.number,
    crb32_stageyear: values.stageYear,
    crb32_claimanttext: values.claimantName || undefined,
    crb32_defendanttext: values.defendantName || undefined,
    crb32_jungledistrict: values.jungleDistrict,
    crb32_stagename: values.stageName as Crb32_stagesesBase['crb32_stagename'],
    crb32_description: values.description || undefined,
    statecode: 0,
  };
}

export function buildStageUpdatePayload(
  values: StageFormValues
): Partial<Omit<Crb32_stagesesBase, 'crb32_stagesid'>> {
  return {
    crb32_newcolumn: stagePrimaryName(values),
    crb32_number: values.number,
    crb32_stageyear: values.stageYear,
    crb32_claimanttext: values.claimantName || undefined,
    crb32_defendanttext: values.defendantName || undefined,
    crb32_jungledistrict: values.jungleDistrict,
    crb32_stagename: values.stageName as Crb32_stagesesBase['crb32_stagename'],
    crb32_description: values.description || undefined,
  };
}

// ---------- Update ----------

export function toUpdateRecord(row: Crb32_updateses): UpdateRecord {
  return {
    id: row.crb32_updatesid,
    caseId: row._crb32_cases_value ?? '',
    stageId: row._crb32_stage_value,
    stageLabel: row.crb32_stagename,
    updateType: row.crb32_updatetype,
    updateTypeLabel: row.crb32_updatetypename ?? labelForOption(UPDATE_TYPE_OPTIONS, row.crb32_updatetype),
    currentDate: row.crb32_currentdate,
    date: row.crb32_date,
    documentsProvided: row.crb32_documentsprovided,
    description: row.crb32_description,
  };
}

export function buildUpdateCreatePayload(
  caseId: string,
  values: UpdateFormValues
): Omit<Crb32_updatesesBase, 'crb32_updatesid'> {
  if (!values.stageId) {
    throw new Error('Stage is required.');
  }
  const now = new Date().toISOString();
  return {
    'crb32_Cases@odata.bind': bind(CASES_SET, caseId),
    'crb32_Stage@odata.bind': bind(STAGES_SET, values.stageId),
    crb32_updatetype: values.updateType as Crb32_updatesesBase['crb32_updatetype'],
    crb32_currentdate: now,
    crb32_date: values.date || undefined,
    crb32_documentsprovided: values.documentsProvided || undefined,
    crb32_description: values.description || undefined,
    statecode: 0,
  };
}

export function buildUpdateUpdatePayload(
  values: UpdateFormValues
): Partial<Omit<Crb32_updatesesBase, 'crb32_updatesid'>> {
  const payload: Partial<Omit<Crb32_updatesesBase, 'crb32_updatesid'>> = {
    crb32_updatetype: values.updateType as Crb32_updatesesBase['crb32_updatetype'],
    crb32_date: values.date || undefined,
    crb32_documentsprovided: values.documentsProvided || undefined,
    crb32_description: values.description || undefined,
  };
  if (values.stageId) {
    payload['crb32_Stage@odata.bind'] = bind(STAGES_SET, values.stageId);
  }
  return payload;
}

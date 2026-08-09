/*
 * Friendly choice-option lists derived from the generated Dataverse option-set
 * constants. Values are the raw Dataverse option-set integers; labels are the
 * Arabic display text configured on the columns.
 */
import {
  Crb32_casesescrb32_ty,
} from '../generated/models/Crb32_casesesModel';
import {
  Crb32_stagesescrb32_stagename,
} from '../generated/models/Crb32_stagesesModel';
import {
  Crb32_updatesescrb32_updatetype,
} from '../generated/models/Crb32_updatesesModel';

export interface ChoiceOption {
  value: number;
  label: string;
}

function toOptions(source: Record<number, string>): ChoiceOption[] {
  return Object.entries(source).map(([value, label]) => ({
    value: Number(value),
    label,
  }));
}

export const CASE_TYPE_OPTIONS: ChoiceOption[] = toOptions(Crb32_casesescrb32_ty);
export const STAGE_NAME_OPTIONS: ChoiceOption[] = toOptions(Crb32_stagesescrb32_stagename);
export const UPDATE_TYPE_OPTIONS: ChoiceOption[] = toOptions(Crb32_updatesescrb32_updatetype);

export function labelForOption(options: ChoiceOption[], value: number | undefined): string {
  if (value === undefined) return '';
  return options.find((o) => o.value === value)?.label ?? '';
}

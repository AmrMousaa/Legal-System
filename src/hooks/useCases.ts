import { useCallback, useState } from 'react';
import { Crb32_casesesService } from '../generated/services/Crb32_casesesService';
import { toCaseRecord, withResolvedResponsibleNames, withResolvedCurrentStageName } from '../types/mappers';
import { useAutoRefresh } from './useAutoRefresh';
import { getUserDirectory } from './userDirectory';
import { getStageDirectory } from './stageDirectory';
import type { AsyncStatus, CaseRecord } from '../types/domain';

const SELECT = [
  'crb32_casesid',
  'crb32_from',
  'crb32_to',
  'crb32_description',
  'crb32_link',
  'crb32_ty',
  '_crb32_responsible_value',
  '_crb32_secondresponsible_value',
  '_crb32_currentstage_value',
  'createdon',
];

export function useCases() {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(undefined);
    const result = await Crb32_casesesService.getAll({
      select: SELECT,
      orderBy: ['createdon desc'],
    });
    if (result.success) {
      const [userDirectory, stageDirectory] = await Promise.all([getUserDirectory(), getStageDirectory()]);
      setCases(
        result.data
          .map(toCaseRecord)
          .map((r) => withResolvedResponsibleNames(r, userDirectory))
          .map((r) => withResolvedCurrentStageName(r, stageDirectory))
      );
      setStatus('success');
    } else {
      setError(result.error?.message ?? 'Failed to load cases.');
      setStatus('error');
    }
  }, []);

  useAutoRefresh(refresh);

  return { cases, status, error, refresh };
}

export function useCase(caseId: string | undefined) {
  const [record, setRecord] = useState<CaseRecord | undefined>();
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setStatus('loading');
    setError(undefined);
    const result = await Crb32_casesesService.get(caseId, { select: SELECT });
    if (result.success) {
      const [userDirectory, stageDirectory] = await Promise.all([getUserDirectory(), getStageDirectory()]);
      const withNames = withResolvedResponsibleNames(toCaseRecord(result.data), userDirectory);
      setRecord(withResolvedCurrentStageName(withNames, stageDirectory));
      setStatus('success');
    } else {
      setError(result.error?.message ?? 'Failed to load case.');
      setStatus('error');
    }
  }, [caseId]);

  useAutoRefresh(refresh);

  return { record, status, error, refresh };
}

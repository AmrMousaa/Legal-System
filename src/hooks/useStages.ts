import { useCallback, useState } from 'react';
import { Crb32_stagesesService } from '../generated/services/Crb32_stagesesService';
import { toStageRecord } from '../types/mappers';
import { useAutoRefresh } from './useAutoRefresh';
import type { AsyncStatus, StageRecord } from '../types/domain';

const SELECT = [
  'crb32_stagesid',
  'crb32_number',
  'crb32_stageyear',
  'crb32_claimanttext',
  'crb32_defendanttext',
  'crb32_jungledistrict',
  'crb32_stagename',
  'crb32_description',
  'crb32_autonum',
  '_crb32_case_value',
  'createdon',
];

export function useStagesForCase(caseId: string | undefined) {
  const [stages, setStages] = useState<StageRecord[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setStatus('loading');
    setError(undefined);
    const result = await Crb32_stagesesService.getAll({
      select: SELECT,
      filter: `_crb32_case_value eq '${caseId}'`,
      orderBy: ['createdon asc'],
    });
    if (result.success) {
      setStages(result.data.map(toStageRecord));
      setStatus('success');
    } else {
      setError(result.error?.message ?? 'Failed to load stages.');
      setStatus('error');
    }
  }, [caseId]);

  useAutoRefresh(refresh);

  return { stages, status, error, refresh };
}

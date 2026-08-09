import { useCallback, useState } from 'react';
import { Crb32_updatesesService } from '../generated/services/Crb32_updatesesService';
import { toUpdateRecord } from '../types/mappers';
import { useAutoRefresh } from './useAutoRefresh';
import type { AsyncStatus, UpdateRecord } from '../types/domain';

const SELECT = [
  'crb32_updatesid',
  'crb32_updatetype',
  'crb32_currentdate',
  'crb32_date',
  'crb32_documentsprovided',
  'crb32_description',
  '_crb32_cases_value',
  '_crb32_stage_value',
];

export function useUpdatesForCase(caseId: string | undefined) {
  const [updates, setUpdates] = useState<UpdateRecord[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    if (!caseId) return;
    setStatus('loading');
    setError(undefined);
    const result = await Crb32_updatesesService.getAll({
      select: SELECT,
      filter: `_crb32_cases_value eq '${caseId}'`,
      orderBy: ['crb32_date desc'],
    });
    if (result.success) {
      setUpdates(result.data.map(toUpdateRecord));
      setStatus('success');
    } else {
      setError(result.error?.message ?? 'Failed to load updates.');
      setStatus('error');
    }
  }, [caseId]);

  useAutoRefresh(refresh);

  return { updates, status, error, refresh };
}

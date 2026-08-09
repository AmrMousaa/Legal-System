import { useCallback, useState } from 'react';
import { SystemusersService } from '../generated/services/SystemusersService';
import { useAutoRefresh } from './useAutoRefresh';
import type { AsyncStatus, UserOption } from '../types/domain';

export function useUsers() {
  const [users, setUsers] = useState<UserOption[]>([]);
  const [status, setStatus] = useState<AsyncStatus>('idle');
  const [error, setError] = useState<string | undefined>();

  const refresh = useCallback(async () => {
    setStatus('loading');
    setError(undefined);
    const result = await SystemusersService.getAll({
      select: ['systemuserid', 'fullname'],
      filter: 'isdisabled eq false',
      orderBy: ['fullname asc'],
    });
    if (result.success) {
      setUsers(
        result.data
          .filter((u) => !!u.fullname)
          .map((u) => ({ id: u.systemuserid, fullName: u.fullname ?? '' }))
      );
      setStatus('success');
    } else {
      setError(result.error?.message ?? 'Failed to load users.');
      setStatus('error');
    }
  }, []);

  useAutoRefresh(refresh);

  return { users, status, error, refresh };
}

import type { UpdateRecord } from '../../types/domain';
import { UpdatesTable } from './UpdatesTable';

export function UpdatesTab({ updates }: { updates: UpdateRecord[] }) {
  return <UpdatesTable updates={updates} showStage />;
}

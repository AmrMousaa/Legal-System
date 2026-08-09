import { Crb32_stagesesService } from '../generated/services/Crb32_stagesesService';
import { toStageRecord, formatStageLabel } from '../types/mappers';

/*
 * Like userDirectory.ts: the `crb32_cases` table's Current Stage lookup has
 * no server-computed name column, so we resolve its display label
 * client-side from the Stage table's own (real, selectable) columns instead
 * of relying on a `crb32_currentstagename`-style field.
 */
let cache: Map<string, string> | null = null;
let inflight: Promise<Map<string, string>> | null = null;

const SELECT = ['crb32_stagesid', 'crb32_number', 'crb32_stageyear', 'crb32_stagename'];

export async function getStageDirectory(): Promise<Map<string, string>> {
  if (cache) return cache;
  if (!inflight) {
    inflight = Crb32_stagesesService.getAll({ select: SELECT }).then((result) => {
      const map = new Map<string, string>();
      if (result.success) {
        for (const row of result.data) {
          const stage = toStageRecord(row);
          map.set(stage.id, formatStageLabel(stage));
        }
      }
      cache = map;
      inflight = null;
      return map;
    });
  }
  return inflight;
}

export function invalidateStageDirectory() {
  cache = null;
}

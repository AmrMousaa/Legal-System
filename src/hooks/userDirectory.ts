import { SystemusersService } from '../generated/services/SystemusersService';

/*
 * The `crb32_cases` table doesn't have server-computed "name" virtual columns
 * for its Responsible/Second Responsible lookups (unlike Stage/Update, which
 * do), so we resolve display names client-side against the systemusers table
 * instead of relying on a `crb32_responsiblename`-style field. Cached in
 * memory for the session since the user directory changes rarely.
 */
let cache: Map<string, string> | null = null;
let inflight: Promise<Map<string, string>> | null = null;

export async function getUserDirectory(): Promise<Map<string, string>> {
  if (cache) return cache;
  if (!inflight) {
    inflight = SystemusersService.getAll({ select: ['systemuserid', 'fullname'] }).then((result) => {
      const map = new Map<string, string>();
      if (result.success) {
        for (const u of result.data) {
          if (u.fullname) map.set(u.systemuserid, u.fullname);
        }
      }
      cache = map;
      inflight = null;
      return map;
    });
  }
  return inflight;
}

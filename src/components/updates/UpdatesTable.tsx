import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Text,
  makeStyles,
  tokens,
} from '@fluentui/react-components';
import { DocumentRegular } from '@fluentui/react-icons';
import type { UpdateRecord } from '../../types/domain';
import { Pill } from '../common/Pill';
import { palette } from '../../theme';
import { EmptyState } from '../common/StatusViews';

const useStyles = makeStyles({
  wrap: {
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: tokens.borderRadiusLarge,
    overflow: 'hidden',
  },
  headerCell: {
    fontSize: '11px',
    fontWeight: 700,
    color: palette.black[500],
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    backgroundColor: palette.black[200],
  },
  row: {
    ':hover': {
      backgroundColor: palette.gold[50],
    },
  },
  desc: {
    fontSize: '13px',
    color: palette.textPrimary,
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: palette.black[500],
  },
  date: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.textPrimary,
    whiteSpace: 'nowrap',
  },
});

export function UpdatesTable({ updates, showStage }: { updates: UpdateRecord[]; showStage?: boolean }) {
  const styles = useStyles();

  if (updates.length === 0) {
    return <EmptyState title="No updates yet" subtitle="Updates recorded here will appear in a table, most recent first." />;
  }

  return (
    <div className={styles.wrap}>
      <Table size="medium">
        <TableHeader>
          <TableRow>
            <TableHeaderCell className={styles.headerCell}>Date</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Type</TableHeaderCell>
            {showStage && <TableHeaderCell className={styles.headerCell}>Stage</TableHeaderCell>}
            <TableHeaderCell className={styles.headerCell}>Description</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>Documents</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {updates.map((u) => (
            <TableRow key={u.id} className={styles.row}>
              <TableCell>
                <span className={styles.date}>{u.date ? new Date(u.date).toLocaleDateString() : '—'}</span>
              </TableCell>
              <TableCell>{u.updateTypeLabel ? <Pill tone="green">{u.updateTypeLabel}</Pill> : '—'}</TableCell>
              {showStage && <TableCell>{u.stageLabel ? <Pill tone="outline">{u.stageLabel}</Pill> : '—'}</TableCell>}
              <TableCell>
                <Text className={styles.desc} wrap>
                  {u.description || '—'}
                </Text>
              </TableCell>
              <TableCell>
                {u.documentsProvided ? (
                  <span className={styles.meta}>
                    <DocumentRegular fontSize={14} />
                    {u.documentsProvided}
                  </span>
                ) : (
                  '—'
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import {
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Text,
  makeStyles,
} from '@fluentui/react-components';
import { DocumentRegular } from '@fluentui/react-icons';
import type { UpdateRecord } from '../../types/domain';
import { Badge } from '../ui/Badge';
import { palette, radius } from '../../theme';
import { EmptyState } from '../ui/StatusViews';
import { useT } from '../../i18n';

const useStyles = makeStyles({
  wrap: {
    border: `1px solid ${palette.borderSubtle}`,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  headerCell: {
    fontSize: '11px',
    fontWeight: 700,
    color: palette.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    backgroundColor: palette.neutral[100],
  },
  row: {
    ':hover': {
      backgroundColor: palette.brass[50],
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
    color: palette.neutral[500],
  },
  date: {
    fontSize: '13px',
    fontWeight: 600,
    color: palette.textPrimary,
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
  },
});

export function UpdatesTable({ updates, showStage }: { updates: UpdateRecord[]; showStage?: boolean }) {
  const styles = useStyles();
  const t = useT();

  if (updates.length === 0) {
    return <EmptyState title={t('no_updates_title')} subtitle={t('no_updates_subtitle')} />;
  }

  return (
    <div className={styles.wrap}>
      <Table size="medium">
        <TableHeader>
          <TableRow>
            <TableHeaderCell className={styles.headerCell}>{t('col_date')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('col_type')}</TableHeaderCell>
            {showStage && <TableHeaderCell className={styles.headerCell}>{t('col_stage')}</TableHeaderCell>}
            <TableHeaderCell className={styles.headerCell}>{t('col_description')}</TableHeaderCell>
            <TableHeaderCell className={styles.headerCell}>{t('col_documents')}</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {updates.map((u) => (
            <TableRow key={u.id} className={styles.row}>
              <TableCell>
                <span className={styles.date}>
                  {u.date ? new Date(u.date).toLocaleDateString('en-GB') : '—'}
                </span>
              </TableCell>
              <TableCell>{u.updateTypeLabel ? <Badge tone="sage">{u.updateTypeLabel}</Badge> : '—'}</TableCell>
              {showStage && <TableCell>{u.stageLabel ? <Badge tone="outline">{u.stageLabel}</Badge> : '—'}</TableCell>}
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

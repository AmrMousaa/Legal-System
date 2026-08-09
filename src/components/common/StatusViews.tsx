import { Spinner, Text, makeStyles, tokens } from '@fluentui/react-components';
import { ErrorCircleRegular, DocumentSearchRegular } from '@fluentui/react-icons';
import { palette } from '../../theme';

const useStyles = makeStyles({
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '48px 24px',
    color: tokens.colorNeutralForeground3,
  },
  errorIcon: {
    color: palette.error[500],
    fontSize: '28px',
  },
  emptyIcon: {
    fontSize: '28px',
    color: palette.gold[500],
  },
});

export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  const styles = useStyles();
  return (
    <div className={styles.center}>
      <Spinner label={label} />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const styles = useStyles();
  return (
    <div className={styles.center}>
      <ErrorCircleRegular className={styles.errorIcon} />
      <Text weight="semibold">{message}</Text>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            cursor: 'pointer',
            color: palette.gold[600],
            fontWeight: 600,
            background: 'none',
            border: 'none',
            font: 'inherit',
            padding: 0,
          }}
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  const styles = useStyles();
  return (
    <div className={styles.center}>
      <DocumentSearchRegular className={styles.emptyIcon} />
      <Text weight="semibold">{title}</Text>
      {subtitle && <Text size={200}>{subtitle}</Text>}
    </div>
  );
}

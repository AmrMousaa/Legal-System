import { Spinner, Text, makeStyles } from '@fluentui/react-components';
import { ErrorCircleRegular, DocumentSearchRegular } from '@fluentui/react-icons';
import { palette, radius } from '../../theme';
import { useT } from '../../i18n';

const useStyles = makeStyles({
  center: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    padding: '56px 24px',
    textAlign: 'center',
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '52px',
    height: '52px',
    borderRadius: radius.pill,
  },
  errorIconWrap: {
    backgroundColor: palette.error[100],
    color: palette.error[500],
  },
  emptyIconWrap: {
    backgroundColor: palette.brass[100],
    color: palette.brass[600],
  },
  title: {
    fontSize: '15px',
    fontWeight: 700,
    color: palette.textPrimary,
  },
  subtitle: {
    fontSize: '13px',
    color: palette.textSecondary,
    maxWidth: '360px',
  },
  retry: {
    cursor: 'pointer',
    color: palette.brass[600],
    fontWeight: 700,
    background: 'none',
    border: 'none',
    font: 'inherit',
    fontSize: '13px',
    padding: '4px 2px',
  },
});

export function LoadingState({ label }: { label?: string }) {
  const styles = useStyles();
  return (
    <div className={`${styles.center} diwan-page-enter`}>
      <Spinner label={label} />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const styles = useStyles();
  const t = useT();
  return (
    <div className={`${styles.center} diwan-page-enter`}>
      <span className={`${styles.iconWrap} ${styles.errorIconWrap}`}>
        <ErrorCircleRegular fontSize={26} />
      </span>
      <Text className={styles.title}>{message}</Text>
      {onRetry && (
        <button type="button" onClick={onRetry} className={styles.retry}>
          {t('try_again')}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title, subtitle }: { title: string; subtitle?: string }) {
  const styles = useStyles();
  return (
    <div className={`${styles.center} diwan-page-enter`}>
      <span className={`${styles.iconWrap} ${styles.emptyIconWrap}`}>
        <DocumentSearchRegular fontSize={26} />
      </span>
      <Text className={styles.title}>{title}</Text>
      {subtitle && <Text className={styles.subtitle}>{subtitle}</Text>}
    </div>
  );
}

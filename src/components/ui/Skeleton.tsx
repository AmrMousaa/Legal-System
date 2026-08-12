import { makeStyles } from '@fluentui/react-components';
import { palette, radius } from '../../theme';

const useStyles = makeStyles({
  card: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: radius.lg,
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
});

function Bar({ width, height = '12px' }: { width: string; height?: string }) {
  return <div className="diwan-skeleton" style={{ width, height }} />;
}

export function SkeletonCaseCard() {
  const styles = useStyles();
  return (
    <div className={styles.card}>
      <div className={styles.row}>
        <Bar width="40%" height="16px" />
        <Bar width="10%" height="16px" />
        <Bar width="30%" height="16px" />
      </div>
      <Bar width="70%" />
      <div className={styles.row}>
        <div className="diwan-skeleton" style={{ width: '28px', height: '28px', borderRadius: '999px' }} />
        <Bar width="40%" />
      </div>
      <div className={styles.row}>
        <Bar width="30%" height="22px" />
        <Bar width="30%" height="22px" />
      </div>
    </div>
  );
}

export function SkeletonCaseGrid({ count = 6 }: { count?: number }) {
  const styles = useStyles();
  return (
    <div className={styles.grid}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCaseCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonBlock({ width = '100%', height = '80px' }: { width?: string; height?: string }) {
  return <div className="diwan-skeleton" style={{ width, height }} />;
}

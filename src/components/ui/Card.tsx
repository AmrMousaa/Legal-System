import { makeStyles } from '@fluentui/react-components';
import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { palette, radius, shadow, motion } from '../../theme';

const useStyles = makeStyles({
  card: {
    backgroundColor: palette.cardBg,
    border: `1px solid ${palette.border}`,
    borderRadius: radius.lg,
    boxShadow: shadow.xs,
  },
  interactive: {
    cursor: 'pointer',
    transitionProperty: 'box-shadow, transform, border-color',
    transitionDuration: motion.base,
    transitionTimingFunction: motion.easing,
    outlineStyle: 'none',
    ':hover': {
      boxShadow: shadow.md,
      border: `1px solid ${palette.brass[400]}`,
      transform: 'translateY(-2px)',
    },
    ':focus-visible': {
      border: `1px solid ${palette.brass[500]}`,
      boxShadow: `0 0 0 3px ${palette.brass[200]}`,
    },
  },
});

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
  style?: CSSProperties;
}

export function Card({ children, interactive, className, style, ...rest }: CardProps) {
  const styles = useStyles();
  return (
    <div
      className={`${styles.card} ${interactive ? styles.interactive : ''} ${className ?? ''}`}
      style={style}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

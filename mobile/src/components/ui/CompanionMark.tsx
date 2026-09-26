import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/hooks/use-theme';

export type CompanionMarkProps = {
  size?: number;
  /** monochrome renders both circles in the same color (for on-dark or small contexts) */
  monochrome?: boolean;
};

/**
 * The CompanionHub mark: two overlapping circles — one ink, one coral —
 * standing in for two people's paths crossing for a shared activity. Used
 * as the app mark, the verified badge, and the recurring empty-state motif.
 * Deliberately not a camera (Instagram) or a speech-bubble/"f" (Facebook,
 * Messenger) — nothing borrowed from an existing app's visual language.
 */
export function CompanionMark({ size = 40, monochrome = false }: CompanionMarkProps) {
  const theme = useTheme();
  const r = size * 0.32;
  const offset = size * 0.18;
  const center = size / 2;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Circle
        cx={center - offset}
        cy={center}
        r={r}
        fill={monochrome ? theme.textOnInk : theme.ink}
        fillOpacity={0.92}
      />
      <Circle
        cx={center + offset}
        cy={center}
        r={r}
        fill={monochrome ? theme.textOnInk : theme.coral}
        fillOpacity={monochrome ? 0.55 : 0.85}
      />
    </Svg>
  );
}

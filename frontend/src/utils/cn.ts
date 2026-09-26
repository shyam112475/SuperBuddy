/**
 * Merge class names safely - utility for Tailwind CSS
 * Simple implementation without external dependencies
 */
export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  return classes
    .flatMap((cls) => {
      if (!cls) return [];
      if (typeof cls === 'string') return cls.split(/\s+/).filter(Boolean);
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([, value]) => value)
          .map(([key]) => key.split(/\s+/).filter(Boolean))
          .flat();
      }
      return [];
    })
    .filter(Boolean)
    .join(' ');
}

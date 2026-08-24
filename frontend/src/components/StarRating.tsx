export function StarRating({
  value,
  onChange,
  size = 'md',
}: {
  value: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  const isInteractive = Boolean(onChange);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!isInteractive}
          onClick={() => onChange?.(star)}
          className={isInteractive ? 'cursor-pointer' : 'cursor-default'}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <svg
            viewBox="0 0 20 20"
            fill={star <= value ? '#f59e0b' : '#e5e7eb'}
            className={sizeClass}
          >
            <path d="M10 1.5l2.472 5.008 5.528.803-4 3.899.944 5.507L10 14.25l-4.944 2.467.944-5.507-4-3.899 5.528-.803z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

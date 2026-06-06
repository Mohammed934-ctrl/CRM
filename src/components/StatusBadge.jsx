export default function StatusBadge({ status }) {
  const styles = {
    New:       'bg-[var(--chart-1)]/15 text-[var(--chart-1)]',
    Contacted: 'bg-[var(--chart-5)]/15 text-[var(--chart-5)]',
    Qualified: 'bg-[var(--chart-4)]/15 text-[var(--chart-4)]',
    Converted: 'bg-[var(--chart-2)]/15 text-[var(--chart-2)]',
    Lost:      'bg-[var(--chart-3)]/15 text-[var(--chart-3)]',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium ${styles[status] || styles.New}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}
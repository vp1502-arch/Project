const styles: Record<string, string> = {
  active: 'bg-unilever-green/15 text-unilever-green',
  beta: 'bg-unilever-cyan/15 text-unilever-cyan',
  deprecated: 'bg-gray-200 text-gray-600',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${
        styles[status] ?? 'bg-gray-200 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
}

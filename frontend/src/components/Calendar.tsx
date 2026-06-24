import { useState } from 'react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

interface CalendarProps {
  selected: Date | null;
  onSelect: (d: Date) => void;
}

// A lightweight month-view date picker (weekdays only, no past dates) —
// the "pick a day" half of an Outlook-style meeting booker.
export default function Calendar({ selected, onSelect }: CalendarProps) {
  const today = startOfDay(new Date());
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function isDisabled(d: Date) {
    const wd = d.getDay();
    return d < today || wd === 0 || wd === 6; // past or weekend
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setView(new Date(year, month - 1, 1))}
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="font-semibold text-gray-900">
          {view.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
        </div>
        <button
          type="button"
          onClick={() => setView(new Date(year, month + 1, 1))}
          className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const disabled = isDisabled(d);
          const isSelected = selected && sameDay(d, selected);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(d)}
              className={[
                'h-9 rounded-md text-sm transition',
                disabled
                  ? 'cursor-not-allowed text-gray-300'
                  : 'text-gray-700 hover:bg-unilever-blue/10',
                isSelected ? 'bg-unilever-blue text-white hover:bg-unilever-blue' : '',
              ].join(' ')}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

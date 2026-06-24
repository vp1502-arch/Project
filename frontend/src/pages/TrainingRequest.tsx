import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type Tool } from '../api';
import Calendar from '../components/Calendar';
import { downloadIcs } from '../ics';

// Working-hour start times (24h). Lunch hour (13:00) intentionally omitted.
const TIME_SLOTS = [9, 10, 11, 12, 14, 15, 16];

function formatHour(h: number) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:00 ${period}`;
}

export default function TrainingRequest() {
  const [params] = useSearchParams();
  const preselected = params.get('tool');
  const [tools, setTools] = useState<Tool[]>([]);
  const [toolId, setToolId] = useState(preselected ?? '');
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<number | null>(null);
  const [duration, setDuration] = useState(60);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [booking, setBooking] = useState<{ start: Date; toolName: string } | null>(null);

  useEffect(() => {
    api.get('/tools').then((res) => setTools(res.data));
  }, []);

  const selectedTool = useMemo(
    () => tools.find((t) => String(t.id) === String(toolId)),
    [tools, toolId]
  );

  const startDate = useMemo(() => {
    if (!date || slot === null) return null;
    const d = new Date(date);
    d.setHours(slot, 0, 0, 0);
    return d;
  }, [date, slot]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!toolId) return setError('Please choose a tool.');
    if (!startDate) return setError('Please pick a date and time slot.');
    try {
      await api.post('/training', {
        toolId: Number(toolId),
        requesterName: name,
        requesterEmail: email,
        requestedSlot: startDate.toISOString(),
        durationMins: duration,
        notes,
      });
      setBooking({ start: startDate, toolName: selectedTool?.name ?? 'AI tool' });
    } catch {
      setError('Could not book your training. Please check the form and try again.');
    }
  }

  function addToCalendar() {
    if (!booking) return;
    downloadIcs(`training-${booking.toolName.replace(/\s+/g, '-').toLowerCase()}`, {
      title: `AI Hub training: ${booking.toolName}`,
      description: `Training session for ${booking.toolName}, booked via AI Hub (Unilever Mumbai).${
        notes ? `\nNotes: ${notes}` : ''
      }`,
      start: booking.start,
      durationMins: duration,
      organizerEmail: 'aihub@unilever.com',
      attendeeEmail: email,
    });
  }

  if (booking) {
    return (
      <div className="max-w-xl">
        <div className="rounded-2xl border border-unilever-green/30 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-unilever-green/15 text-unilever-green text-xl">
              ✓
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Training booked</h1>
          </div>
          <div className="mt-5 rounded-xl bg-unilever-surface p-4">
            <div className="text-sm text-gray-500">Tool</div>
            <div className="font-semibold text-gray-900">{booking.toolName}</div>
            <div className="mt-3 text-sm text-gray-500">When</div>
            <div className="font-semibold text-gray-900">
              {booking.start.toLocaleString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              · {duration} min
            </div>
            <div className="mt-3 text-sm text-gray-500">Attendee</div>
            <div className="font-semibold text-gray-900">
              {name} · {email}
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Add this session to Outlook (or any calendar) using the invite below. The point of
            contact will confirm the session.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={addToCalendar}
              className="rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark"
            >
              📅 Add to Outlook calendar (.ics)
            </button>
            <button
              onClick={() => {
                setBooking(null);
                setSlot(null);
              }}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Book another
            </button>
          </div>
        </div>
      </div>
    );
  }

  const field =
    'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-unilever-blue focus:outline-none';

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold text-gray-900">Schedule a training</h1>
      <p className="mt-1 text-gray-600">
        Pick a date and time slot — just like setting up a meeting in Outlook.
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <label className="block text-sm font-medium text-gray-700">
            Tool
            <select required value={toolId} onChange={(e) => setToolId(e.target.value)} className={field}>
              <option value="">Select a tool…</option>
              {tools.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">Choose a date</div>
            <Calendar
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setSlot(null);
              }}
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="text-sm font-medium text-gray-700 mb-1">
              Available time slots {date ? `· ${date.toLocaleDateString()}` : ''}
            </div>
            {!date ? (
              <p className="rounded-lg bg-unilever-surface p-4 text-sm text-gray-500">
                Select a date to see available time slots.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setSlot(h)}
                    className={[
                      'rounded-lg border px-2 py-2 text-sm font-medium transition',
                      slot === h
                        ? 'border-unilever-blue bg-unilever-blue text-white'
                        : 'border-gray-300 text-gray-700 hover:border-unilever-blue hover:bg-unilever-blue/5',
                    ].join(' ')}
                  >
                    {formatHour(h)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Duration
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className={field}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Your name
            <input required value={name} onChange={(e) => setName(e.target.value)} className={field} />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Your email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Notes
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={field} />
          </label>

          {startDate && (
            <div className="rounded-lg bg-unilever-blue/5 p-3 text-sm text-gray-700">
              Booking:{' '}
              <span className="font-semibold">
                {startDate.toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </span>{' '}
              · {duration} min
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark"
          >
            Book training
          </button>
        </div>
      </form>
    </div>
  );
}

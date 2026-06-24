// Generates an iCalendar (.ics) invite so a booked training can be added to
// Outlook / Google Calendar / Apple Calendar with one click.

interface IcsEvent {
  title: string;
  description: string;
  start: Date;
  durationMins: number;
  organizerEmail?: string;
  attendeeEmail?: string;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

// Format a Date as a UTC iCal timestamp: YYYYMMDDTHHMMSSZ
function toIcsUtc(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeText(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcs(ev: IcsEvent): string {
  const end = new Date(ev.start.getTime() + ev.durationMins * 60_000);
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@aihub.unilever`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AI Hub Unilever Mumbai//Training//EN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(ev.start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(ev.title)}`,
    `DESCRIPTION:${escapeText(ev.description)}`,
    ev.organizerEmail ? `ORGANIZER;CN=AI Hub:mailto:${ev.organizerEmail}` : '',
    ev.attendeeEmail
      ? `ATTENDEE;CN=${ev.attendeeEmail};RSVP=TRUE:mailto:${ev.attendeeEmail}`
      : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean);
  return lines.join('\r\n');
}

export function downloadIcs(filename: string, ev: IcsEvent): void {
  const blob = new Blob([buildIcs(ev)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

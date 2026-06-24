import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, type Tool } from '../api';

export default function TrainingRequest() {
  const [params] = useSearchParams();
  const preselected = params.get('tool');
  const [tools, setTools] = useState<Tool[]>([]);
  const [form, setForm] = useState({
    toolId: preselected ?? '',
    requesterName: '',
    requesterEmail: '',
    preferredDates: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tools').then((res) => setTools(res.data));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/training', {
        toolId: Number(form.toolId),
        requesterName: form.requesterName,
        requesterEmail: form.requesterEmail,
        preferredDates: form.preferredDates,
        notes: form.notes,
      });
      setSubmitted(true);
    } catch {
      setError('Could not submit your request. Please check the form and try again.');
    }
  }

  if (submitted) {
    return (
      <div className="max-w-lg rounded-xl border border-unilever-green/30 bg-unilever-green/5 p-6">
        <h1 className="text-xl font-bold text-gray-900">Request submitted ✅</h1>
        <p className="mt-2 text-gray-600">
          Thanks! The point of contact will reach out to schedule your training.
        </p>
      </div>
    );
  }

  const field = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-unilever-blue focus:outline-none';

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-extrabold text-gray-900">Schedule a training</h1>
      <p className="mt-1 text-gray-600">Request a training session for an AI tool.</p>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Tool
          <select
            required
            value={form.toolId}
            onChange={(e) => setForm({ ...form, toolId: e.target.value })}
            className={field}
          >
            <option value="">Select a tool…</option>
            {tools.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Your name
          <input
            required
            value={form.requesterName}
            onChange={(e) => setForm({ ...form, requesterName: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Your email
          <input
            required
            type="email"
            value={form.requesterEmail}
            onChange={(e) => setForm({ ...form, requesterEmail: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Preferred date(s) / time(s)
          <input
            value={form.preferredDates}
            onChange={(e) => setForm({ ...form, preferredDates: e.target.value })}
            placeholder="e.g. Next Tuesday afternoon"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Notes
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className={field}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          className="rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark"
        >
          Submit request
        </button>
      </form>
    </div>
  );
}

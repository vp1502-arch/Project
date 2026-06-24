import { useEffect, useState } from 'react';
import { api, type TrainingRequest } from '../../api';

const statuses = ['new', 'scheduled', 'completed', 'cancelled'];

export default function AdminTraining() {
  const [requests, setRequests] = useState<TrainingRequest[]>([]);

  function load() {
    api.get('/training').then((res) => setRequests(res.data));
  }

  useEffect(load, []);

  async function updateStatus(id: number, status: string) {
    await api.put(`/training/${id}`, { status });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Training requests</h1>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Requester</th>
              <th className="px-4 py-3">Tool</th>
              <th className="px-4 py-3">Booked slot</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{r.requesterName}</div>
                  <div className="text-xs text-gray-500">{r.requesterEmail}</div>
                </td>
                <td className="px-4 py-3 text-gray-600">{r.tool?.name ?? r.toolId}</td>
                <td className="px-4 py-3 text-gray-600">
                  {r.requestedSlot
                    ? new Date(r.requestedSlot).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }) + ` · ${r.durationMins ?? 60}m`
                    : r.preferredDates || '—'}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value)}
                    className="rounded-lg border border-gray-300 px-2 py-1 text-sm capitalize"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No training requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

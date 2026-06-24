import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Tool } from '../../api';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../auth';

export default function AdminTools() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);

  function load() {
    api.get('/tools', { params: { includeDrafts: 'true' } }).then((res) => setTools(res.data));
  }

  useEffect(load, []);

  async function remove(id: number) {
    if (!confirm('Delete this tool? This cannot be undone.')) return;
    await api.delete(`/tools/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-gray-900">Manage tools</h1>
        <Link
          to="/admin/tools/new"
          className="rounded-lg bg-unilever-blue px-4 py-2 font-semibold text-white hover:bg-unilever-dark"
        >
          + New tool
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Publish</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tools.map((t) => (
              <tr key={t.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{t.name}</td>
                <td className="px-4 py-3 text-gray-600">{t.category?.name ?? '—'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{t.publishState}</td>
                <td className="px-4 py-3 text-right space-x-3">
                  <Link to={`/admin/tools/${t.id}/edit`} className="text-unilever-blue hover:underline">
                    Edit
                  </Link>
                  {user?.role === 'admin' && (
                    <button onClick={() => remove(t.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  No tools yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

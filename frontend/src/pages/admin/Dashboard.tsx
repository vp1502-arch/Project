import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Tool, type TrainingRequest } from '../../api';
import { useAuth } from '../../auth';

export default function Dashboard() {
  const { user } = useAuth();
  const [tools, setTools] = useState<Tool[]>([]);
  const [requests, setRequests] = useState<TrainingRequest[]>([]);

  useEffect(() => {
    api.get('/tools', { params: { includeDrafts: 'true' } }).then((res) => setTools(res.data));
    api.get('/training').then((res) => setRequests(res.data)).catch(() => {});
  }, []);

  const newRequests = requests.filter((r) => r.status === 'new').length;

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-gray-900">Admin dashboard</h1>
      <p className="mt-1 text-gray-600">Welcome back, {user?.name}.</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-3xl font-extrabold text-unilever-blue">{tools.length}</div>
          <div className="text-sm text-gray-500">Tools in catalog</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-3xl font-extrabold text-unilever-cyan">{requests.length}</div>
          <div className="text-sm text-gray-500">Training requests</div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="text-3xl font-extrabold text-unilever-green">{newRequests}</div>
          <div className="text-sm text-gray-500">New requests</div>
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          to="/admin/tools"
          className="rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark"
        >
          Manage tools
        </Link>
        <Link
          to="/admin/training"
          className="rounded-lg border border-unilever-blue px-5 py-2.5 font-semibold text-unilever-blue hover:bg-unilever-blue/5"
        >
          Training requests
        </Link>
      </div>
    </div>
  );
}

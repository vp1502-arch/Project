import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  const field = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-unilever-blue focus:outline-none';

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-2xl font-extrabold text-gray-900">Admin login</h1>
      <p className="mt-1 text-sm text-gray-600">Sign in to manage AI Hub tools and content.</p>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={field}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-gray-400">Demo: admin@unilever.com / admin123</p>
      </form>
    </div>
  );
}

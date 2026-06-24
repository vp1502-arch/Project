import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, type Category } from '../../api';

export default function AdminToolForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    shortDescription: '',
    fullDescription: '',
    url: '',
    logoUrl: '',
    status: 'active',
    publishState: 'published',
    categoryId: '',
    tagNames: '',
  });

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    if (!id) return;
    api.get(`/tools/${id}`).then((res) => {
      const t = res.data;
      setForm({
        name: t.name,
        shortDescription: t.shortDescription,
        fullDescription: t.fullDescription,
        url: t.url,
        logoUrl: t.logoUrl ?? '',
        status: t.status,
        publishState: t.publishState,
        categoryId: t.categoryId ? String(t.categoryId) : '',
        tagNames: t.tags.map((tag: { name: string }) => tag.name).join(', '),
      });
    });
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name,
      shortDescription: form.shortDescription,
      fullDescription: form.fullDescription,
      url: form.url,
      logoUrl: form.logoUrl || null,
      status: form.status,
      publishState: form.publishState,
      categoryId: form.categoryId ? Number(form.categoryId) : null,
      tagNames: form.tagNames
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editing) await api.put(`/tools/${id}`, payload);
      else await api.post('/tools', payload);
      navigate('/admin/tools');
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Could not save the tool. Check the fields.');
    }
  }

  const field = 'mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-unilever-blue focus:outline-none';

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-extrabold text-gray-900">{editing ? 'Edit tool' : 'New tool'}</h1>

      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6">
        <label className="block text-sm font-medium text-gray-700">
          Name *
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Short description *
          <input
            required
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Full description *
          <textarea
            required
            rows={4}
            value={form.fullDescription}
            onChange={(e) => setForm({ ...form, fullDescription: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Tool URL *
          <input
            required
            type="url"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            placeholder="https://…"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Logo URL
          <input
            type="url"
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            placeholder="https://…/logo.png (optional)"
            className={field}
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Category
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={field}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={field}>
              <option value="active">Active</option>
              <option value="beta">Beta</option>
              <option value="deprecated">Deprecated</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-gray-700">
            Publish state
            <select
              value={form.publishState}
              onChange={(e) => setForm({ ...form, publishState: e.target.value })}
              className={field}
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma-separated)
            <input
              value={form.tagNames}
              onChange={(e) => setForm({ ...form, tagNames: e.target.value })}
              placeholder="llm, productivity"
              className={field}
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            className="rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark"
          >
            {editing ? 'Save changes' : 'Create tool'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/tools')}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

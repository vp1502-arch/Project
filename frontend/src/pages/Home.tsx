import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type Category, type Tool } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('name');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { sort };
    if (q) params.q = q;
    if (category) params.category = category;
    api
      .get('/tools', { params })
      .then((res) => setTools(res.data))
      .finally(() => setLoading(false));
  }, [q, category, sort]);

  const heading = useMemo(
    () => (q || category ? `${tools.length} tool${tools.length === 1 ? '' : 's'} found` : 'All AI tools'),
    [q, category, tools.length]
  );

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-r from-unilever-blue to-unilever-dark p-8 text-white mb-8">
        <h1 className="text-3xl font-extrabold">Discover AI tools at Unilever Mumbai</h1>
        <p className="mt-2 max-w-2xl text-white/80">
          One place to explore every AI tool in the facility — descriptions, links, points of
          contact, training docs, and FAQs.
        </p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tools by name, description, or keyword…"
          className="mt-5 w-full max-w-xl rounded-lg px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-unilever-cyan"
        />
      </section>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="name">Sort: Name</option>
          <option value="recent">Sort: Recently updated</option>
          <option value="popular">Sort: Most popular</option>
        </select>
        <span className="ml-auto text-sm text-gray-500">{heading}</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading tools…</p>
      ) : tools.length === 0 ? (
        <p className="text-gray-500">No tools match your search.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              to={`/tools/${tool.slug}`}
              className="group flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-unilever-blue/40"
            >
              <div className="flex items-start justify-between">
                {tool.logoUrl ? (
                  <img
                    src={tool.logoUrl}
                    alt={`${tool.name} logo`}
                    className="h-11 w-11 rounded-lg object-contain bg-white border border-gray-200 p-1"
                  />
                ) : (
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-unilever-blue/10 text-unilever-blue font-bold">
                    {tool.name.charAt(0)}
                  </div>
                )}
                <StatusBadge status={tool.status} />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-unilever-blue">
                {tool.name}
              </h3>
              <p className="mt-1 flex-1 text-sm text-gray-600 line-clamp-3">{tool.shortDescription}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {tool.category && (
                  <span className="rounded-full bg-unilever-cyan/10 px-2 py-0.5 text-xs font-medium text-unilever-cyan">
                    {tool.category.name}
                  </span>
                )}
                {tool.tags.slice(0, 2).map((t) => (
                  <span key={t.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    #{t.name}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

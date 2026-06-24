import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, type Tool } from '../api';
import StatusBadge from '../components/StatusBadge';

export default function ToolDetail() {
  const { slug } = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    api
      .get(`/tools/${slug}`)
      .then((res) => setTool(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  function openTool() {
    if (!tool) return;
    api.post(`/tools/${tool.id}/click`).catch(() => {});
    window.open(tool.url, '_blank', 'noopener');
  }

  if (notFound) return <p className="text-gray-500">Tool not found. <Link className="text-unilever-blue" to="/">Back to catalog</Link></p>;
  if (!tool) return <p className="text-gray-500">Loading…</p>;

  return (
    <div>
      <Link to="/" className="text-sm text-unilever-blue hover:underline">
        ← Back to catalog
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-4">
            {tool.logoUrl ? (
              <img
                src={tool.logoUrl}
                alt={`${tool.name} logo`}
                className="h-14 w-14 rounded-xl object-contain bg-white border border-gray-200 p-1"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-unilever-blue/10 text-2xl font-bold text-unilever-blue">
                {tool.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-gray-900">{tool.name}</h1>
                <StatusBadge status={tool.status} />
              </div>
              {tool.category && (
                <p className="mt-1 text-sm text-unilever-cyan font-medium">{tool.category.name}</p>
              )}
            </div>
          </div>
          <p className="mt-4 text-gray-700 whitespace-pre-line">{tool.fullDescription}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={openTool}
              className="rounded-lg bg-unilever-blue px-5 py-2.5 font-semibold text-white hover:bg-unilever-dark"
            >
              Open tool ↗
            </button>
            <Link
              to={`/training/request?tool=${tool.id}`}
              className="rounded-lg border border-unilever-blue px-5 py-2.5 font-semibold text-unilever-blue hover:bg-unilever-blue/5"
            >
              Schedule a training
            </Link>
          </div>

          {tool.trainingDocs.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-gray-900">Training documents</h2>
              <ul className="mt-3 space-y-2">
                {tool.trainingDocs.map((d) => (
                  <li key={d.id}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-unilever-blue hover:underline"
                    >
                      📄 {d.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tool.faqs.length > 0 && (
            <section className="mt-8">
              <h2 className="text-lg font-bold text-gray-900">FAQs</h2>
              <div className="mt-3 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
                {tool.faqs.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setOpenFaq(openFaq === f.id ? null : f.id)}
                    className="block w-full px-4 py-3 text-left"
                  >
                    <span className="font-medium text-gray-900">{f.question}</span>
                    {openFaq === f.id && <p className="mt-2 text-sm text-gray-600">{f.answer}</p>}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          {tool.pocs.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-gray-900">Points of contact</h3>
              <ul className="mt-3 space-y-3">
                {tool.pocs.map((p) => (
                  <li key={p.id}>
                    <div className="font-medium text-gray-900">{p.name}</div>
                    {p.role && <div className="text-xs text-gray-500">{p.role}</div>}
                    <a href={`mailto:${p.email}`} className="text-sm text-unilever-blue hover:underline">
                      {p.email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-500">
            <div>Popularity: {tool.clickCount} opens</div>
            <div className="mt-1">Updated: {new Date(tool.updatedAt).toLocaleDateString()}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}

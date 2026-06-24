import { useEffect, useState } from 'react';
import { api, type Faq } from '../api';

export default function Faqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    api.get('/faqs', { params: { global: 'true' } }).then((res) => setFaqs(res.data));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold text-gray-900">Frequently asked questions</h1>
      <p className="mt-1 text-gray-600">Platform-wide questions about AI Hub.</p>

      <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 bg-white">
        {faqs.length === 0 && <p className="p-4 text-gray-500">No FAQs yet.</p>}
        {faqs.map((f) => (
          <button
            key={f.id}
            onClick={() => setOpen(open === f.id ? null : f.id)}
            className="block w-full px-5 py-4 text-left"
          >
            <span className="font-medium text-gray-900">{f.question}</span>
            {open === f.id && <p className="mt-2 text-sm text-gray-600">{f.answer}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

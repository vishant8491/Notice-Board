import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';

export default function NewNotice() {
  const router = useRouter();

  async function handleSubmit(values) {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload.error || 'Could not create the notice.');
      err.fieldErrors = payload.fieldErrors;
      throw err;
    }

    router.push('/');
  }

  return (
    <Layout title="New notice — Notice Board">
      <Link href="/" className="focus-ring text-sm text-ink/50 hover:text-ink">
        ← Back to all notices
      </Link>
      <h1 className="font-display text-2xl font-semibold text-ink mt-3 mb-6">Post a new notice</h1>
      <NoticeForm onSubmit={handleSubmit} submitLabel="Post notice" />
    </Layout>
  );
}

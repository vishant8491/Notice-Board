import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import NoticeForm from '@/components/NoticeForm';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return { props: { notice: JSON.parse(JSON.stringify(notice)) } };
}

export default function EditNotice({ notice }) {
  const router = useRouter();

  async function handleSubmit(values) {
    const res = await fetch(`/api/notices/${notice.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      const err = new Error(payload.error || 'Could not update the notice.');
      err.fieldErrors = payload.fieldErrors;
      throw err;
    }

    router.push('/');
  }

  return (
    <Layout title="Edit notice — Notice Board">
      <Link href="/" className="focus-ring text-sm text-ink/50 hover:text-ink">
        ← Back to all notices
      </Link>
      <h1 className="font-display text-2xl font-semibold text-ink mt-3 mb-6">Edit notice</h1>
      <NoticeForm initialNotice={notice} onSubmit={handleSubmit} submitLabel="Save changes" />
    </Layout>
  );
}

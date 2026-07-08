import { useState } from 'react';
import Layout from '@/components/Layout';
import NoticeCard from '@/components/NoticeCard';
import ConfirmDialog from '@/components/ConfirmDialog';
import { prisma } from '@/lib/prisma';

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
  });
  return { props: { initialNotices: JSON.parse(JSON.stringify(notices)) } };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/notices/${pendingDelete.id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) {
        throw new Error('Could not delete this notice. Please try again.');
      }
      setNotices((prev) => prev.filter((n) => n.id !== pendingDelete.id));
      setPendingDelete(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Layout>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">All notices</h1>
        <span className="text-sm font-mono text-ink/40">
          {notices.length} {notices.length === 1 ? 'notice' : 'notices'}
        </span>
      </div>

      {error && (
        <p className="mb-4 rounded-md bg-urgent/10 border border-urgent/30 text-urgent text-sm px-4 py-3">
          {error}
        </p>
      )}

      {notices.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line py-16 text-center">
          <p className="font-display text-lg text-ink/70">No notices yet</p>
          <p className="mt-1 text-sm text-ink/50">
            Post the first one so students and staff know what's happening.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleteClick={setPendingDelete} />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this notice?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" will be permanently removed. This can't be undone.`
            : ''
        }
        confirmLabel={deleting ? 'Deleting…' : 'Delete'}
        cancelLabel="Cancel"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </Layout>
  );
}

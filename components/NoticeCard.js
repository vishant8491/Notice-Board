import Link from 'next/link';

const CATEGORY_STYLES = {
  Exam: 'bg-accent2/10 text-accent2 border-accent2/20',
  Event: 'bg-accent/10 text-accent border-accent/20',
  General: 'bg-ink/5 text-ink/60 border-ink/10',
};

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === 'Urgent';

  return (
    <article
      className={`relative rounded-lg border bg-white p-5 flex flex-col sm:flex-row gap-4 ${
        isUrgent ? 'border-urgent/40' : 'border-line'
      }`}
    >
      {isUrgent && (
        <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-urgent px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
          Urgent
        </span>
      )}

      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="w-full sm:w-32 h-32 object-cover rounded-md border border-line shrink-0"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span
            className={`inline-block rounded border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General}`}
          >
            {notice.category}
          </span>
          <span className="text-xs font-mono text-ink/40">{formatDate(notice.publishDate)}</span>
        </div>

        <h2 className="font-display text-lg font-semibold text-ink leading-snug break-words">
          {notice.title}
        </h2>
        <p className="mt-1 text-sm text-ink/70 line-clamp-3 whitespace-pre-line break-words">
          {notice.body}
        </p>

        <div className="mt-3 flex gap-4 text-sm">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="focus-ring rounded font-medium text-accent hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onDeleteClick(notice)}
            className="focus-ring rounded font-medium text-urgent hover:underline"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

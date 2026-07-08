import { useState } from 'react';

const CATEGORIES = ['Exam', 'Event', 'General'];
const PRIORITIES = ['Normal', 'Urgent'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB, matches the copy shown to the user

function toDateInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialNotice, onSubmit, submitLabel = 'Save notice' }) {
  const [title, setTitle] = useState(initialNotice?.title || '');
  const [body, setBody] = useState(initialNotice?.body || '');
  const [category, setCategory] = useState(initialNotice?.category || 'General');
  const [priority, setPriority] = useState(initialNotice?.priority || 'Normal');
  const [publishDate, setPublishDate] = useState(
    toDateInputValue(initialNotice?.publishDate) || toDateInputValue(new Date())
  );
  const [image, setImage] = useState(initialNotice?.image || null);
  const [imageError, setImageError] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    setImageError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  }

  function validateClientSide() {
    const next = {};
    if (!title.trim()) next.title = 'Title is required.';
    if (!body.trim()) next.body = 'Body is required.';
    if (!CATEGORIES.includes(category)) next.category = 'Choose a category.';
    if (!PRIORITIES.includes(priority)) next.priority = 'Choose a priority.';
    if (!publishDate || Number.isNaN(new Date(publishDate).getTime())) {
      next.publishDate = 'A valid date is required.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    // Client-side validation is only a convenience; the API route re-validates
    // everything on the server, which is the check that actually matters.
    if (!validateClientSide()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        body: body.trim(),
        category,
        priority,
        publishDate,
        image,
      });
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
      if (err.fieldErrors) setErrors(err.fieldErrors);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && (
        <p className="rounded-md bg-urgent/10 border border-urgent/30 text-urgent text-sm px-4 py-3">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-ink mb-1.5">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="focus-ring w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30"
          placeholder="e.g. Mid-semester exam schedule released"
          maxLength={200}
        />
        {errors.title && <p className="mt-1 text-xs text-urgent">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-ink mb-1.5">
          Body
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="focus-ring w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/30"
          placeholder="Full details of the notice…"
        />
        {errors.body && <p className="mt-1 text-xs text-urgent">{errors.body}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-ink mb-1.5">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="focus-ring w-full rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-urgent">{errors.category}</p>}
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-1.5">Priority</span>
          <div className="flex gap-2">
            {PRIORITIES.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`focus-ring flex-1 rounded-md border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  priority === p
                    ? p === 'Urgent'
                      ? 'bg-urgent text-white border-urgent'
                      : 'bg-accent text-white border-accent'
                    : 'bg-white text-ink/70 border-line hover:bg-ink/5'
                }`}
                aria-pressed={priority === p}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.priority && <p className="mt-1 text-xs text-urgent">{errors.priority}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-medium text-ink mb-1.5">
          Publish date
        </label>
        <input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
          className="focus-ring w-full sm:w-64 rounded-md border border-line bg-white px-3.5 py-2.5 text-sm text-ink"
        />
        {errors.publishDate && <p className="mt-1 text-xs text-urgent">{errors.publishDate}</p>}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-ink mb-1.5">
          Image <span className="text-ink/40 font-normal">(optional)</span>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="focus-ring block w-full text-sm text-ink/70 file:mr-4 file:rounded-md file:border-0 file:bg-ink/5 file:px-3.5 file:py-2 file:text-sm file:font-medium hover:file:bg-ink/10"
        />
        {imageError && <p className="mt-1 text-xs text-urgent">{imageError}</p>}
        {image && (
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Selected notice" className="h-20 w-20 rounded-md object-cover border border-line" />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="focus-ring text-sm text-ink/60 hover:text-urgent"
            >
              Remove image
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="focus-ring rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

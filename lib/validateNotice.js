const CATEGORIES = ['Exam', 'Event', 'General'];
const PRIORITIES = ['Normal', 'Urgent'];

const MAX_IMAGE_LENGTH = 7_000_000;

export function validateNotice(body) {
  const errors = {};
  const data = {};

  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) {
    errors.title = 'Title is required.';
  } else if (title.length > 200) {
    errors.title = 'Title must be 200 characters or fewer.';
  } else {
    data.title = title;
  }

  const noticeBody = typeof body.body === 'string' ? body.body.trim() : '';
  if (!noticeBody) {
    errors.body = 'Body is required.';
  } else {
    data.body = noticeBody;
  }

  const category = body.category;
  if (!CATEGORIES.includes(category)) {
    errors.category = `Category must be one of: ${CATEGORIES.join(', ')}.`;
  } else {
    data.category = category;
  }

  const priority = body.priority;
  if (!PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}.`;
  } else {
    data.priority = priority;
  }

  const rawDate = body.publishDate;
  const parsedDate = rawDate ? new Date(rawDate) : null;
  if (!rawDate || Number.isNaN(parsedDate?.getTime())) {
    errors.publishDate = 'A valid publish date is required.';
  } else {
    data.publishDate = parsedDate;
  }

  // Image is optional. If present it must be a reasonably small base64 data URL.
  if (body.image !== undefined && body.image !== null && body.image !== '') {
    if (typeof body.image !== 'string' || !body.image.startsWith('data:image/')) {
      errors.image = 'Image must be a valid image file.';
    } else if (body.image.length > MAX_IMAGE_LENGTH) {
      errors.image = 'Image is too large. Please use a file under roughly 5MB.';
    } else {
      data.image = body.image;
    }
  } else {
    data.image = null;
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}

import { prisma } from '@/lib/prisma';
import { validateNotice } from '@/lib/validateNotice';

// Raise the default 1MB body limit so a base64-encoded notice image fits.
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId) || noticeId <= 0) {
    return res.status(400).json({ error: 'Invalid notice id.' });
  }

  if (req.method === 'GET') {
    return handleGet(req, res, noticeId);
  }
  if (req.method === 'PUT' || req.method === 'PATCH') {
    return handleUpdate(req, res, noticeId);
  }
  if (req.method === 'DELETE') {
    return handleDelete(req, res, noticeId);
  }
  res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleGet(req, res, noticeId) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
    if (!notice) {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    return res.status(200).json(notice);
  } catch (err) {
    console.error('Failed to fetch notice:', err);
    return res.status(500).json({ error: 'Could not load notice.' });
  }
}

async function handleUpdate(req, res, noticeId) {
  const { valid, errors, data } = validateNotice(req.body || {});
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed.', fieldErrors: errors });
  }

  try {
    const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    const notice = await prisma.notice.update({ where: { id: noticeId }, data });
    return res.status(200).json(notice);
  } catch (err) {
    console.error('Failed to update notice:', err);
    return res.status(500).json({ error: 'Could not update notice.' });
  }
}

async function handleDelete(req, res, noticeId) {
  try {
    const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found.' });
    }
    await prisma.notice.delete({ where: { id: noticeId } });
    return res.status(204).end();
  } catch (err) {
    console.error('Failed to delete notice:', err);
    return res.status(500).json({ error: 'Could not delete notice.' });
  }
}

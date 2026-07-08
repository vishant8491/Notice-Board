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
  if (req.method === 'GET') {
    return handleList(req, res);
  }
  if (req.method === 'POST') {
    return handleCreate(req, res);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}

async function handleList(req, res) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [{ priority: 'desc' }, { publishDate: 'desc' }],
    });
    return res.status(200).json(notices);
  } catch (err) {
    console.error('Failed to list notices:', err);
    return res.status(500).json({ error: 'Could not load notices.' });
  }
}

async function handleCreate(req, res) {
  const { valid, errors, data } = validateNotice(req.body || {});
  if (!valid) {
    return res.status(400).json({ error: 'Validation failed.', fieldErrors: errors });
  }

  try {
    const notice = await prisma.notice.create({ data });
    return res.status(201).json(notice);
  } catch (err) {
    console.error('Failed to create notice:', err);
    return res.status(500).json({ error: 'Could not create notice.' });
  }
}

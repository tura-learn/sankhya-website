import { createHash } from 'node:crypto';

import { admin, getAdminDb } from './_firebase-admin.js';

// The Manu waitlist: one email, once. The document id is a hash of the address, so joining
// twice is harmless and the address is not in the path. Nothing is read back to the caller.
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/;
const ALREADY_EXISTS = 6;

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const body = Buffer.concat(chunks).toString('utf8');
  return body ? JSON.parse(body) : {};
}

// Served by api/web.js (?op=waitlist): the Hobby plan caps the project at 12 functions.
export async function joinWaitlist(req, res) {
  let body;
  try {
    body = await readJson(req);
  } catch {
    return res.status(400).json({ error: 'Send an email address.' });
  }

  // A field people never see: a bot that fills it is thanked and forgotten.
  if (String(body.company || '').trim()) return res.status(200).json({ joined: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) {
    return res.status(400).json({ error: 'That does not look like an email address.' });
  }

  const id = createHash('sha256').update(email).digest('hex');
  try {
    await getAdminDb()
      .collection('manuWaitlist')
      .doc(id)
      .create({
        email,
        page: String(body.page || '').slice(0, 80),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  } catch (error) {
    if (error?.code !== ALREADY_EXISTS) {
      console.error('waitlist: could not save', error?.message || error);
      return res.status(500).json({ error: 'Could not join just now. Try again in a minute.' });
    }
  }
  return res.status(200).json({ joined: true });
}

/**
 * /api/subscribe.js
 * Vercel Serverless Function — Kaola Yuzu Newsletter
 *
 * Flow: browser POST → this function → Brevo Contacts API
 * API key never reaches the browser.
 *
 * Environment variables required in Vercel dashboard:
 *   BREVO_API_KEY   — your Brevo v3 API key
 *   BREVO_LIST_ID   — numeric ID of the Brevo list to add contacts to
 *
 * Returns JSON:
 *   { status: 'success' }
 *   { status: 'duplicate' }
 *   { status: 'error', message: '...' }
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';

// Simple server-side email regex (RFC 5322 lite)
function isValidEmail(email) {
  return typeof email === 'string' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export default async function handler(req, res) {
  // --- Method guard ---
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }

  // --- Environment variable guard ---
  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  if (!apiKey || !listId) {
    console.error('[subscribe] Missing env vars: BREVO_API_KEY or BREVO_LIST_ID');
    return res.status(500).json({ status: 'error', message: 'Server misconfiguration' });
  }

  // --- Parse body ---
  const { email } = req.body || {};

  // --- Validate email ---
  if (!isValidEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'Invalid email address' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const listIdNum  = parseInt(listId, 10);

  // --- Call Brevo Contacts API ---
  try {
    const brevoRes = await fetch(BREVO_API_URL, {
      method:  'POST',
      headers: {
        'accept':       'application/json',
        'content-type': 'application/json',
        'api-key':      apiKey,
      },
      body: JSON.stringify({
        email:        cleanEmail,
        listIds:      [listIdNum],
        updateEnabled: false,   // don't overwrite existing contacts
        // Optionally add attributes here:
        // attributes: { FIRSTNAME: '', SOURCE: 'kaolayuzu_website' }
      }),
    });

    // Brevo 201 = created successfully
    if (brevoRes.status === 201) {
      return res.status(200).json({ status: 'success' });
    }

    // Brevo 204 = contact already exists (when updateEnabled: false)
    if (brevoRes.status === 204) {
      return res.status(200).json({ status: 'duplicate' });
    }

    // Brevo returns error details in JSON
    const brevoData = await brevoRes.json().catch(() => ({}));

    // Code 'duplicate_parameter' also means already subscribed
    if (brevoData.code === 'duplicate_parameter') {
      return res.status(200).json({ status: 'duplicate' });
    }

    console.error('[subscribe] Brevo error:', brevoRes.status, brevoData);
    return res.status(502).json({
      status:  'error',
      message: brevoData.message || 'Brevo API error',
    });

  } catch (err) {
    console.error('[subscribe] Network/fetch error:', err);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

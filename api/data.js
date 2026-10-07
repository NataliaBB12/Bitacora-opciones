const STORAGE_KEY = 'smallcaps:data';

module.exports = async (req, res) => {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'storage_not_configured' });
  }

  if (req.method === 'GET') {
    const r = await fetch(`${KV_URL}/get/${STORAGE_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` }
    });
    if (!r.ok) return res.status(502).json({ error: 'kv_error' });
    const j = await r.json();
    let data = null;
    if (j.result) {
      try { data = JSON.parse(j.result); } catch { data = null; }
    }
    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    const value = JSON.stringify(body || {});
    const r = await fetch(`${KV_URL}/set/${STORAGE_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
      body: value
    });
    if (!r.ok) return res.status(502).json({ error: 'kv_error' });
    const j = await r.json();
    if (j.result !== 'OK') return res.status(500).json({ error: 'save_failed' });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'method_not_allowed' });
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const password = body && body.password;
  const expected = process.env.APP_PASSWORD;

  if (!expected) {
    return res.status(500).json({ error: 'not_configured' });
  }
  if (password === expected) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
};

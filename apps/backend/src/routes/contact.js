const { Router } = require('express');

const router = Router();

// POST /api/contact
// Body: { name, email, organization?, inquiryType, message }
router.post('/', async (req, res) => {
  const { name, email, organization, inquiryType, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email, and message are required' });
  }

  const subject = `[Archive Contact] ${inquiryType ?? 'General Inquiry'} from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    organization ? `Organization: ${organization}` : null,
    `Inquiry type: ${inquiryType ?? 'General'}`,
    '',
    message,
  ].filter(Boolean).join('\n');

  const toEmail = process.env.CONTACT_TO_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey && toEmail) {
    try {
      const { Resend } = require('resend');
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Archive Contact <onboarding@resend.dev>',
        to: toEmail,
        replyTo: email,
        subject,
        text,
      });
    } catch (err) {
      console.error('Resend error:', err.message);
      // Don't fail the request — submission is still logged below
    }
  } else {
    console.log('Contact form submission (no email configured):\n' + text);
  }

  res.json({ ok: true });
});

module.exports = router;

import { smtpConfigured, mailTransport } from './mail.js';
if (!smtpConfigured()) { console.error('SMTP configuration is incomplete. Check SMTP_HOST, SMTP_USER, SMTP_PASS and SMTP_TO.'); process.exitCode=1; }
else { const transport=mailTransport(); try { await transport.verify(); console.log('SMTP connection and authentication verified. No email sent.'); } catch(error) { console.error('SMTP verification failed:', error.code || 'EMAIL_ERROR', error.responseCode || ''); process.exitCode=1; } finally { transport.close(); } }

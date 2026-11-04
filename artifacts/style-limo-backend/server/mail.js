import './env.js';
import nodemailer from 'nodemailer';
import { randomUUID } from 'node:crypto';

export const smtpConfigured = () => Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.SMTP_TO);
export const mailTransport = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  connectionTimeout: 15000, greetingTimeout: 15000, socketTimeout: 30000,
});
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function bookingMessages(request, journeyEnquiry, reference) {
  const labels = journeyEnquiry
    ? {name:'Name',email:'Email',phone:'Phone',pickup:'Pick-up location',destination:'Destination',date:'Travel date',time:'Pick-up time (UK)',passengers:'Passengers',service:'Journey type',notes:'Journey notes'}
    : {name:'Name',email:'Email',phone:'Phone',service:'Service',vehicle:'Vehicle',date:'Travel date',duration:'Duration'};
  const entries = Object.entries(labels).map(([key,label]) => [label,request[key] || 'Not provided']);
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const make = customer => {
    const title = customer ? 'Your enquiry has been received' : 'New journey enquiry';
    const intro = customer ? `Thank you, ${request.name}. Our booking team will review your request and contact you with availability and a quotation.` : 'A customer has submitted a journey request. Please review the details below and reply to the customer.';
    const notice = 'This is an enquiry receipt. Your booking is only confirmed separately by our booking team.';
    return {
      from, to: customer ? request.email : process.env.SMTP_TO,
      replyTo: customer ? (process.env.SMTP_REPLY_TO || process.env.SMTP_TO) : { name: request.name.replace(/[\r\n]/g,' '), address: request.email },
      subject: `${customer ? 'Enquiry received' : 'New enquiry'} | ${reference} | Style Express Limousines`,
      text: ['STYLE EXPRESS LIMOUSINES',title,intro,`Reference: ${reference}`,'',...entries.map(([label,value])=>`${label}: ${value}`),'',notice].join('\n'),
      html: `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta charset="UTF-8"></head><body style="margin:0;background:#f4f0e5;font-family:Arial,sans-serif;color:#29271f"><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:100%;max-width:600px;background:#fff9e8;border:1px solid #e6d8b4"><tr><td style="padding:28px;background:#171917;color:#ffbf00;font-size:20px;font-weight:bold;letter-spacing:2px">STYLE EXPRESS<br><span style="font-size:11px;letter-spacing:4px">LIMOUSINES</span></td></tr><tr><td style="padding:28px"><p style="color:#8b6919;font-size:12px">REFERENCE ${escape(reference)}</p><h1 style="font-family:Georgia,serif;font-size:30px;font-weight:normal">${title}</h1><p style="line-height:1.7">${escape(intro)}</p><table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="table-layout:fixed">${entries.map(([label,value])=>`<tr><td width="38%" style="padding:12px 8px 12px 0;border-bottom:1px solid #e6d8b4;font-size:13px;vertical-align:top">${label}</td><td style="padding:12px 0;border-bottom:1px solid #e6d8b4;font-size:14px;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word">${escape(value)}</td></tr>`).join('')}</table><p style="margin-top:24px;padding:16px;background:#f8edcc;line-height:1.6;font-size:13px">${notice}</p><p style="font-size:13px;line-height:1.6">${customer ? 'Need to update your journey? Reply to this email and quote your reference.' : 'Reply to this email to contact the customer directly.'}</p></td></tr><tr><td style="padding:18px 28px;background:#171917;color:#e6d8b4;font-size:12px">Style Express Limousines &middot; Every journey, considered.</td></tr></table></td></tr></table></body></html>`,
    };
  };
  return { team: make(false), customer: make(true) };
}
function ensureAccepted(result) {
  if (result.rejected?.length) throw Object.assign(new Error('SMTP recipient rejected'), {code:'ERECIPIENT'});
}
export async function sendBookingEmails(request, journeyEnquiry, transport = mailTransport()) {
  const reference = `SE-${randomUUID().slice(0,8).toUpperCase()}`;
  const messages = bookingMessages(request,journeyEnquiry,reference);
  ensureAccepted(await transport.sendMail(messages.team));
  let confirmationSent = true;
  try { ensureAccepted(await transport.sendMail(messages.customer)); }
  catch (error) { confirmationSent = false; console.error('Enquiry receipt failed', {reference,code:error.code || 'EMAIL_ERROR'}); }
  return {sent:true,confirmationSent,reference};
}

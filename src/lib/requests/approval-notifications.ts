/**
 * src/lib/requests/approval-notifications.ts
 *
 * Sends email and (optionally) in-app notifications when a project request
 * is approved or rejected by an admin.
 *
 * Uses the existing `sendEmail` infrastructure — safe, sanitized HTML.
 */
import { sendEmail } from '@/lib/email/service';

interface ApprovalNotificationInput {
    userEmail: string;
    userName: string;
    requestTitle: string;
    locale?: string;       // 'ar' | 'en'
    reason?: string;       // rejection reason (optional)
}

function escapeHtml(s: string) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

function safeText(s?: string | null) {
    return escapeHtml((s ?? '').trim().slice(0, 2000));
}

// ── Approved ─────────────────────────────────────────────────────────────────

export async function sendApprovalNotification(input: ApprovalNotificationInput) {
    const { userEmail, userName, requestTitle, locale = 'en' } = input;
    const isAr = locale === 'ar';

    const subject = isAr
        ? `✅ تمت الموافقة على طلبك: ${safeText(requestTitle)}`
        : `✅ Your project request was approved: ${safeText(requestTitle)}`;

    const bodyText = isAr
        ? `مرحباً ${safeText(userName)},\n\nتمت الموافقة على طلبك "${safeText(requestTitle)}" وهو الآن ظاهر للشركات.\n\nشكراً لاستخدامك المنصة.`
        : `Hi ${safeText(userName)},\n\nYour project request "${safeText(requestTitle)}" has been approved and is now visible to companies.\n\nThank you for using the platform.`;

    const html = `
    <div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#16a34a;">✅ ${isAr ? 'تمت الموافقة على طلبك' : 'Project Request Approved'}</h2>
      <p>${isAr ? 'مرحباً' : 'Hi'} <strong>${safeText(userName)}</strong>,</p>
      <p>${isAr ? 'تمت الموافقة على طلبك' : 'Your project request'}: <strong>"${safeText(requestTitle)}"</strong>
         ${isAr ? 'وهو الآن ظاهر للشركات والمزودين.' : 'has been approved and is now visible to companies and service providers.'}
      </p>
      <p style="color:#6b7280;font-size:0.85rem;">${isAr ? 'شكراً لثقتك بمنصتنا.' : 'Thank you for using our platform.'}</p>
    </div>`;

    await sendEmail({ to: userEmail, template: { subject, text: bodyText, html } });
}

// ── Rejected ─────────────────────────────────────────────────────────────────

export async function sendRejectionNotification(input: ApprovalNotificationInput) {
    const { userEmail, userName, requestTitle, locale = 'en', reason } = input;
    const isAr = locale === 'ar';

    const subject = isAr
        ? `❌ تم رفض طلبك: ${safeText(requestTitle)}`
        : `❌ Your project request was not approved: ${safeText(requestTitle)}`;

    const reasonLine = reason
        ? (isAr ? `\n\nالسبب: ${safeText(reason)}` : `\n\nReason: ${safeText(reason)}`)
        : '';

    const bodyText = isAr
        ? `مرحباً ${safeText(userName)},\n\nلم تتم الموافقة على طلبك "${safeText(requestTitle)}".${reasonLine}\n\nيمكنك تعديل الطلب وإعادة إرساله.`
        : `Hi ${safeText(userName)},\n\nYour project request "${safeText(requestTitle)}" was not approved.${reasonLine}\n\nYou may edit and resubmit your request.`;

    const reasonHtml = reason
        ? `<p><strong>${isAr ? 'السبب:' : 'Reason:'}</strong> ${safeText(reason)}</p>`
        : '';

    const html = `
    <div dir="${isAr ? 'rtl' : 'ltr'}" style="font-family:sans-serif;max-width:600px;margin:auto;">
      <h2 style="color:#dc2626;">❌ ${isAr ? 'لم تتم الموافقة على طلبك' : 'Project Request Not Approved'}</h2>
      <p>${isAr ? 'مرحباً' : 'Hi'} <strong>${safeText(userName)}</strong>,</p>
      <p>${isAr ? 'لم تتم الموافقة على طلبك' : 'Your project request'}: <strong>"${safeText(requestTitle)}"</strong>.</p>
      ${reasonHtml}
      <p>${isAr ? 'يمكنك تعديل الطلب وإعادة إرساله.' : 'You may edit and resubmit your request.'}</p>
      <p style="color:#6b7280;font-size:0.85rem;">${isAr ? 'شكراً لثقتك بمنصتنا.' : 'Thank you for using our platform.'}</p>
    </div>`;

    await sendEmail({ to: userEmail, template: { subject, text: bodyText, html } });
}

/**
 * Email Template Configuration
 * These templates are designed to be modern, professional, and consistent with the 
 * Service Marketplace brand. They support both English (LTR) and Arabic (RTL).
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface CommonProps {
    locale?: string;
    title: string;
    previewText?: string;
    footerText?: string;
}

/**
 * Base Shell for all HTML emails
 */
function renderBaseTemplate(props: CommonProps, contentHtml: string): string {
    const isRTL = props.locale === 'ar';
    const primaryColor = '#2563eb';
    const bgColor = '#f8fafc';
    const cardBg = '#ffffff';
    const textColor = '#334155';
    const mutedColor = '#64748b';
    
    return `
<!DOCTYPE html>
<html lang="${props.locale}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${props.title}</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, p, a { font-family: Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <style>
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            height: 100% !important;
            background-color: ${bgColor};
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: ${bgColor};
            padding-bottom: 40px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: ${cardBg};
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        }
        .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, #1d4ed8 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: -0.5px;
        }
        .content {
            padding: 40px 32px;
            color: ${textColor};
            line-height: 1.6;
            ${isRTL ? 'text-align: right;' : 'text-align: left;'}
        }
        .h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            color: #0f172a;
        }
        .p {
            font-size: 16px;
            margin-bottom: 24px;
            color: ${textColor};
        }
        .button-container {
            padding: 24px 0;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: ${primaryColor};
            color: #ffffff !important;
            padding: 16px 36px;
            border-radius: 12px;
            font-weight: 700;
            text-decoration: none;
            font-size: 16px;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.2);
        }
        .footer {
            text-align: center;
            padding: 32px;
            font-size: 14px;
            color: ${mutedColor};
        }
        .divider {
            border-top: 1px solid #e2e8f0;
            margin: 32px 0;
        }
        @media only screen and (max-width: 600px) {
            .content { padding: 32px 20px; }
            .h1 { font-size: 20px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div style="display: none; max-height: 0px; overflow: hidden;">
            ${props.previewText || props.title}
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <div class="container">
                        <div class="header">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" class="logo">
                                ${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}
                            </a>
                        </div>
                        <div class="content">
                            ${contentHtml}
                        </div>
                        <div class="footer">
                            <p style="margin-bottom: 8px;">
                                ${props.footerText || (isRTL ? 'تحتاج مساعدة؟ تواصل مع دعمنا' : 'Need help? Contact our support')}
                            </p>
                            <p style="margin: 0;">
                                ${isRTL ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.' : '© 2024 Service Marketplace. All rights reserved.'}
                            </p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
    `;
}

/**
 * 1. Verification Email Template
 */
export function getVerificationEmailTemplate(
  name: string,
  verificationUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';
  const subject = isRTL ? 'تأكيد بريدك الإلكتروني - سوق الخدمات' : 'Verify Your Email - Service Marketplace';
  
  const content = `
    <h1 class="h1">${isRTL ? 'مرحباً،' : 'Hello,'} ${name}</h1>
    <p class="p">
        ${isRTL 
            ? 'شكراً لتسجيلك في سوق الخدمات. نحن متحمسون لانضمامك إلينا! يرجى النقر على الزر أدناه لتأكيد بريدك الإلكتروني وتفعيل حسابك:' 
            : 'Thank you for registering with Service Marketplace. We\'re excited to have you on board! Please click the button below to verify your email address and activate your account:'}
    </p>
    <div class="button-container">
        <a href="${verificationUrl}" class="button">
            ${isRTL ? 'تأكيد البريد الإلكتروني' : 'Verify Email Address'}
        </a>
    </div>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 8px;">
        ${isRTL ? 'إذا لم يعمل الزر أعلاه، قم بنسخ الرابط التالي ولصقه في متصفحك:' : 'If the button above didn\'t work, copy and paste this link into your browser:'}
    </p>
    <p style="font-size: 14px; word-break: break-all; color: #2563eb;">
        ${verificationUrl}
    </p>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject, previewText: isRTL ? 'قم بتأكيد حسابك للبدء' : 'Verify your account to get started' }, content),
    text: `${isRTL ? 'مرحباً' : 'Hello'} ${name}, ${isRTL ? 'يرجى تأكيد حسابك من هنا:' : 'Please verify your account:'} ${verificationUrl}`
  };
}

/**
 * 2. Welcome Email (After Verification)
 */
export function getWelcomeEmailTemplate(
  name: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || '#'}/${locale}/dashboard`;
  const subject = isRTL ? 'مرحباً بك في سوق الخدمات! 🎉' : 'Welcome to Service Marketplace! 🎉';
  
  const content = `
    <h1 class="h1">${isRTL ? 'أهلاً بك في عائلتنا!' : 'Welcome to the family!'}</h1>
    <p class="p">
        ${isRTL 
            ? 'تم تفعيل حسابك بنجاح. أنت الآن جزء من أكبر منصة للخدمات الموثوقة في المنطقة.' 
            : 'Your account has been activated successfully. You are now part of the leading platform for trusted services in the region.'}
    </p>
    <div class="button-container">
        <a href="${dashboardUrl}" class="button">
            ${isRTL ? 'ابدأ طلبك الأول' : 'Start Your First Request'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject, previewText: isRTL ? 'تم تفعيل حسابك' : 'Account activated successfully' }, content),
    text: `${isRTL ? 'مرحباً' : 'Hello'} ${name}, ${isRTL ? 'تم تفعيل حسابك!' : 'Account activated!'}`
  };
}

/**
 * 3. Password Reset Template
 */
export function getPasswordResetEmailTemplate(
  name: string,
  resetUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';
  const subject = isRTL ? 'إعادة تعيين كلمة المرور - سوق الخدمات' : 'Reset Your Password - Service Marketplace';
  
  const content = `
    <h1 class="h1">${isRTL ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}</h1>
    <p class="p">
        ${isRTL 
            ? 'لقد تلقينا طلباً لإعادة تعيين كلمة المرور. انقر على الزر لتغييرها:' 
            : 'We received a request to reset your password. Click the button to choose a new one:'}
    </p>
    <div class="button-container">
        <a href="${resetUrl}" class="button">
            ${isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject, previewText: isRTL ? 'رابط إعادة التعيين' : 'Password reset link' }, content),
    text: `${isRTL ? 'إعادة تعيين كلمة المرور:' : 'Password reset link:'} ${resetUrl}`
  };
}

/**
 * 4. New Offer Received
 */
export function getNewOfferEmailTemplate(
  userName: string,
  requestTitle: string,
  companyName: string,
  offerAmount: string | number,
  viewOfferUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';
  const subject = isRTL ? `عرض جديد لطلبك: ${requestTitle}` : `New Offer for: ${requestTitle}`;
  
  const content = `
    <h1 class="h1">${isRTL ? 'تلقيت عرضاً جديداً' : 'New Offer Received'}</h1>
    <p class="p">
        ${isRTL 
            ? `أرسلت شركة <strong>${companyName}</strong> عرضاً لطلبك <strong>"${requestTitle}"</strong>.` 
            : `<strong>${companyName}</strong> sent an offer for <strong>"${requestTitle}"</strong>.`}
    </p>
    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; text-align: center;">
        <div style="font-size: 32px; font-weight: 800; color: #2563eb;">${offerAmount}</div>
    </div>
    <div class="button-container">
        <a href="${viewOfferUrl}" class="button">
            ${isRTL ? 'عرض التفاصيل' : 'View Details'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
    text: `${isRTL ? 'تلقيت عرضاً بقيمة' : 'New offer for'} ${offerAmount}: ${viewOfferUrl}`
  };
}

/**
 * 5. Request Status Update
 */
export function getRequestStatusUpdateEmailTemplate(
  userName: string,
  requestTitle: string,
  newStatus: string,
  viewUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';
  const subject = isRTL ? `تحديث للطلب: ${requestTitle}` : `Update for Request: ${requestTitle}`;
  
  const content = `
    <h1 class="h1">${isRTL ? 'تغيرت حالة طلبك' : 'Request Status Updated'}</h1>
    <p class="p">
        ${isRTL ? `حالة طلبك "${requestTitle}" هي الآن:` : `Status for "${requestTitle}" is now:`}
        <strong>${newStatus}</strong>
    </p>
    <div class="button-container">
        <a href="${viewUrl}" class="button">
            ${isRTL ? 'الذهاب إلى الطلب' : 'Go to Request'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
    text: `${isRTL ? 'تحديث للطلب:' : 'Request update:'} ${requestTitle} -> ${newStatus}. ${viewUrl}`
  };
}

/**
 * 6. Existing User Guest Request Detection
 */
export function getNewRequestForExistingUserTemplate(
  name: string,
  loginUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';
  const subject = isRTL ? 'تم ربط طلبك بحسابك' : 'Request linked to account';
  
  const content = `
    <h1 class="h1">${isRTL ? 'مرحباً،' : 'Hello,'} ${name}</h1>
    <p class="p">
        ${isRTL 
            ? 'لقد استلمنا طلب خدمتك الجديد. بما أن لديك حساباً مسجلاً، فقد قمنا بربطه تلقائياً.' 
            : 'We received your new request. Since you already have an account, we\'ve linked it automatically.'}
    </p>
    <div class="button-container">
        <a href="${loginUrl}" class="button">
            ${isRTL ? 'تسجيل الدخول للمتابعة' : 'Login to Continue'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
    text: `${isRTL ? 'قم بتسجيل الدخول لمشاهدة طلبك الجديد:' : 'Login to see your new request:'} ${loginUrl}`
  };
}

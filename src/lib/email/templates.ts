/**
 * Email Template Configuration
 * These templates are designed to be modern, professional, and consistent with the 
 * Service Marketplace brand colors and typography.
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
}

/**
 * Base Shell for all HTML emails (Matches Website Design Tokens)
 */
function renderBaseTemplate(props: CommonProps, contentHtml: string): string {
    const isRTL = props.locale === 'ar';
    
    // Exact colors from globals.css
    const primaryColor = '#1e40af';      // --primary: 226 71% 40%
    const bgColor = '#f8fafc';           // --background: 210 40% 98%
    const cardBg = '#ffffff';            // --card: 0 0% 100%
    const textColor = '#0f172a';         // --foreground: 222 47% 11%
    const mutedColor = '#64748b';        // --muted-foreground: 215 16% 47%
    const borderColor = '#e2e8f0';       // --border: 210 40% 91%
    
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
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid ${borderColor};
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
        }
        .header {
            background-color: ${primaryColor};
            padding: 48px 24px;
            text-align: center;
        }
        .logo {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: -0.5px;
            text-transform: uppercase;
        }
        .content {
            padding: 48px 40px;
            color: ${textColor};
            line-height: 1.7;
            ${isRTL ? 'text-align: right;' : 'text-align: left;'}
        }
        .h1 {
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 20px;
            color: ${textColor};
            letter-spacing: -0.5px;
        }
        .p {
            font-size: 16px;
            margin-bottom: 24px;
            color: ${textColor};
        }
        .button-container {
            padding: 32px 0;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: ${primaryColor};
            color: #ffffff !important;
            padding: 18px 44px;
            border-radius: 10px;
            font-weight: 700;
            text-decoration: none;
            font-size: 16px;
        }
        .footer {
            text-align: center;
            padding: 40px 32px;
            font-size: 13px;
            color: ${mutedColor};
            background-color: #f1f5f9;
        }
        .divider {
            border-top: 1px solid ${borderColor};
            margin: 32px 0;
        }
        @media only screen and (max-width: 600px) {
            .content { padding: 40px 24px; }
            .h1 { font-size: 22px; }
            .button { width: 100%; box-sizing: border-box; }
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
                <td align="center" style="padding: 24px 0;">
                    <div class="container">
                        <div class="header">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || '#'}" class="logo">
                                ${isRTL ? 'سوق الخدمات الموثوق' : 'Service Marketplace'}
                            </a>
                        </div>
                        <div class="content">
                            ${contentHtml}
                        </div>
                        <div class="footer">
                            <p style="margin: 0 0 12px 0; font-weight: 600; color: ${textColor};">
                                ${isRTL ? 'دائماً في خدمتك' : 'Always here for you'}
                            </p>
                            <p style="margin: 0;">
                                ${isRTL ? 'حقوق النشر © 2024 سوق الخدمات. جميع الحقوق محفوظة.' : '© 2024 Service Marketplace. All rights reserved.'}
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
  const subject = isRTL ? 'تفعيل حسابك - سوق الخدمات' : 'Activate Your Account - Service Marketplace';
  
  const content = `
    <h1 class="h1">${isRTL ? 'مرحباً،' : 'Hello,'} ${name}</h1>
    <p class="p">
        ${isRTL 
            ? 'نسعد بانضمامك كعضو جديد في منصتنا. يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني والبدء في استكشاف أفضل مقدمي الخدمات:' 
            : 'We\'re so happy to have you as a new member of our platform. Please click the button below to verify your email address and start exploring the best service providers:'}
    </p>
    <div class="button-container">
        <a href="${verificationUrl}" class="button">
            ${isRTL ? 'تأكيد الحساب الآن' : 'Verify Account Now'}
        </a>
    </div>
    <div class="divider"></div>
    <p style="font-size: 14px; color: #64748b; margin-bottom: 8px;">
        ${isRTL ? 'إذا لم يفتح الزر، قم بنسخ هذا الرابط:' : 'If the button doesn\'t open, copy this link:'}
    </p>
    <p style="font-size: 14px; word-break: break-all; color: #1e40af;">
        ${verificationUrl}
    </p>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject, previewText: isRTL ? 'تفعيل حسابك الجديد' : 'Activate your new account' }, content),
    text: `${isRTL ? 'مرحباً' : 'Hello'} ${name}, ${isRTL ? 'تفعيل الحساب:' : 'Account verification:'} ${verificationUrl}`
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
  const subject = isRTL ? 'أهلاً بك في سوق الخدمات! 🎉' : 'Welcome to Service Marketplace! 🎉';
  
  const content = `
    <h1 class="h1">${isRTL ? 'تم تفعيل حسابك بنجاح!' : 'Your account is ready!'}</h1>
    <p class="p">
        ${isRTL 
            ? 'أهلاً بك في أكبر تجمع للمحترفين في المنطقة. يمكنك الآن البدء في طلب الخدمات أو عرض خدماتك ونمو عملك.' 
            : 'Welcome to the largest gathering of professionals in the region. You can now start requesting services or grow your business by providing services.'}
    </p>
    <div class="button-container">
        <a href="${dashboardUrl}" class="button">
            ${isRTL ? 'استكشف لوحة التحكم' : 'Explore Your Dashboard'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
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
  const subject = isRTL ? 'طلب إعادة تعيين كلمة المرور' : 'Password Reset Request';
  
  const content = `
    <h1 class="h1">${isRTL ? 'هل نسيت كلمة المرور؟' : 'Forgot your password?'}</h1>
    <p class="p">
        ${isRTL 
            ? 'وصلنا طلب لإعادة تعيين كلمة مرور حسابك. إذا كنت أنت من طلب ذلك، اضغط على الزر أدناه:' 
            : 'We received a request to reset your account password. If this was you, please click the button below to proceed:'}
    </p>
    <div class="button-container">
        <a href="${resetUrl}" class="button">
            ${isRTL ? 'تغيير كلمة المرور' : 'Change Password'}
        </a>
    </div>
    <p style="font-size: 14px; color: #64748b;">
        ${isRTL ? 'إذا لم تطلب هذا التغيير، تجاهل هذا البريد تماماً.' : 'If you didn\'t request this, please ignore this email entirely.'}
    </p>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
    text: `${isRTL ? 'تغيير كلمة المرور:' : 'Change password:'} ${resetUrl}`
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
    <h1 class="h1">${isRTL ? 'وصلك عرض جديد!' : 'You have a new offer!'}</h1>
    <p class="p">
        ${isRTL 
            ? `قامت شركة <strong>${companyName}</strong> بتقديم عرض لطلبك <strong>"${requestTitle}"</strong>.` 
            : `<strong>${companyName}</strong> just submitted a professional offer for <strong>"${requestTitle}"</strong>.`}
    </p>
    <div style="background-color: #f1f5f9; border-radius: 12px; padding: 32px; text-align: center; border: 1px dashed #cbd5e1;">
        <span style="font-size: 14px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
            ${isRTL ? 'القيمة التقديرية' : 'Estimated Budget'}
        </span>
        <div style="font-size: 36px; font-weight: 800; color: #1e40af; margin-top: 10px;">${offerAmount}</div>
    </div>
    <div class="button-container">
        <a href="${viewOfferUrl}" class="button">
            ${isRTL ? 'مراجعة وقبول العرض' : 'Review & Accept Offer'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
    text: `${isRTL ? 'وصلك عرض جديد بقيمة' : 'New offer for'} ${offerAmount}: ${viewOfferUrl}`
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
  const subject = isRTL ? `تحديث حالة الطلب: ${requestTitle}` : `Request Update: ${requestTitle}`;
  
  const content = `
    <h1 class="h1">${isRTL ? 'تم تحديث حالة طلبك' : 'Request Status Updated'}</h1>
    <p class="p">
        ${isRTL ? `لقد أصبحت حالة طلبك "${requestTitle}" هي:` : `The status of your request "${requestTitle}" is now:`}
        <strong style="color: #1e40af;">${newStatus}</strong>
    </p>
    <div class="button-container">
        <a href="${viewUrl}" class="button">
            ${isRTL ? 'عرض تفاصيل الحالة' : 'View Status Details'}
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
  const subject = isRTL ? 'تم حفظ طلبك في حسابك' : 'Request Saved to Your Account';
  
  const content = `
    <h1 class="h1">${isRTL ? 'مرحباً مجدداً،' : 'Welcome back,'} ${name}</h1>
    <p class="p">
        ${isRTL 
            ? 'شكراً لإرسال طلبك. لقد تعرفنا على حسابك وقمنا بربط الطلب به تلقائياً. يمكنك متابعته بعد الدخول.' 
            : 'Thank you for your request. We recognized your account and linked it automatically. You can track it after logging in.'}
    </p>
    <div class="button-container">
        <a href="${loginUrl}" class="button">
            ${isRTL ? 'تسجيل الدخول' : 'Sign In Now'}
        </a>
    </div>
  `;

  return {
    subject,
    html: renderBaseTemplate({ locale, title: subject }, content),
    text: `${isRTL ? 'قم بتسجيل الدخول لمتابعة طلبك:' : 'Login to see your request:'} ${loginUrl}`
  };
}

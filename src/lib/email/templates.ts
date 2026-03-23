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
 * 2b. Welcome Email for Companies (Next Steps)
 */
export function getWelcomeCompanyEmailTemplate(
    companyName: string,
    locale: string = 'en'
  ): EmailTemplate {
    const isRTL = locale === 'ar';
    const uploadUrl = `${process.env.NEXT_PUBLIC_APP_URL || '#'}/${locale}/company/dashboard/documents`;
    const subject = isRTL ? 'خطوتك التالية كشركة في سوق الخدمات' : 'Next Steps for Your Company - Service Marketplace';
    
    const content = `
      <h1 class="h1">${isRTL ? 'أهلاً بشركة' : 'Welcome'} ${companyName}!</h1>
      <p class="p">
          ${isRTL 
              ? 'لقد قمت بإنشاء ملفك التجاري بنجاح. الخطوة الأخيرة لتتمكن من إرسال العروض للزبائن هي توثيق هويتك التجارية.' 
              : 'You have successfully created your business profile. The final step to start bidding on jobs is to verify your business identity.'}
      </p>
      <div class="button-container">
          <a href="${uploadUrl}" class="button">
              ${isRTL ? 'رفع وثائق التوثيق' : 'Upload Documents'}
          </a>
      </div>
      <p style="font-size: 14px; color: #64748b;">
          ${isRTL ? 'يستغرق التدقيق في الوثائق من 24 إلى 48 ساعة عادةً.' : 'Document review usually takes 24-48 hours.'}
      </p>
    `;
  
    return {
      subject,
      html: renderBaseTemplate({ locale, title: subject }, content),
      text: `${isRTL ? 'أهلاً بشركة' : 'Welcome'} ${companyName}, ${isRTL ? 'يرجى رفع الوثائق:' : 'Please upload documents:'} ${uploadUrl}`
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
 * 4. New Offer Received (To User)
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
 * 5. Offer Accepted (To Company)
 */
export function getOfferAcceptedEmailTemplate(
    companyName: string,
    clientName: string,
    requestTitle: string,
    contactUrl: string,
    locale: string = 'en'
  ): EmailTemplate {
    const isRTL = locale === 'ar';
    const subject = isRTL ? `مبروك! تم قبول عرضك لـ ${requestTitle}` : `Congrats! Your offer was accepted for ${requestTitle}`;
    
    const content = `
      <h1 class="h1">${isRTL ? 'خبر ممتاز!' : 'Excellent News!'}</h1>
      <p class="p">
          ${isRTL 
              ? `لقد قام الزبون <strong>${clientName}</strong> بالموافقة على عرضك لطلب <strong>"${requestTitle}"</strong>. تهانينا على الفوز بالمهمة!` 
              : `Customer <strong>${clientName}</strong> has just accepted your offer for <strong>"${requestTitle}"</strong>. Congratulations on winning the job!`}
      </p>
      <p class="p">
          ${isRTL ? 'يرجى التواصل مع الزبون الآن لتنسيق الموعد وبدء العمل.' : 'Please contact the customer now to coordinate the timing and start working.'}
      </p>
      <div class="button-container">
          <a href="${contactUrl}" class="button" style="background-color: #22c55e;">
              ${isRTL ? 'تواصل مع الزبون' : 'Contact Customer'}
          </a>
      </div>
    `;
  
    return {
      subject,
      html: renderBaseTemplate({ locale, title: subject }, content),
      text: `${isRTL ? 'مبروك!' : 'Congrats!'} ${isRTL ? 'تم قبول عرضك لـ' : 'Your offer was accepted for'} ${requestTitle}: ${contactUrl}`
    };
}

/**
 * 6. New Message Received
 */
export function getNewMessageEmailTemplate(
    senderName: string,
    requestTitle: string,
    locale: string = 'en'
  ): EmailTemplate {
    const isRTL = locale === 'ar';
    const chatUrl = `${process.env.NEXT_PUBLIC_APP_URL || '#'}/${locale}/dashboard/messages`;
    const subject = isRTL ? `رسالة جديدة من ${senderName}` : `New message from ${senderName}`;
    
    const content = `
      <h1 class="h1">${isRTL ? 'لديك رسالة جديدة' : 'You have a new message'}</h1>
      <p class="p">
          ${isRTL 
              ? `أرسل لك <strong>${senderName}</strong> رسالة جديدة بخصوص الطلب <strong>"${requestTitle}"</strong>.` 
              : `<strong>${senderName}</strong> sent you a new message regarding <strong>"${requestTitle}"</strong>.`}
      </p>
      <div class="button-container">
          <a href="${chatUrl}" class="button">
              ${isRTL ? 'الرد على الرسالة' : 'Reply to Message'}
          </a>
      </div>
    `;
  
    return {
      subject,
      html: renderBaseTemplate({ locale, title: subject }, content),
      text: `${isRTL ? 'رسالة جديدة من' : 'New message from'} ${senderName}: ${chatUrl}`
    };
}

/**
 * 7. Verification Status Update
 */
export function getVerificationStatusEmailTemplate(
    companyName: string,
    isApproved: boolean,
    locale: string = 'en'
  ): EmailTemplate {
    const isRTL = locale === 'ar';
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || '#'}/${locale}/company/dashboard`;
    
    const subject = isApproved 
        ? (isRTL ? 'تم توثيق هويتك بنجاح!' : 'Your Identity is Verified!') 
        : (isRTL ? 'يوجد مشكلة في وثائق التوثيق' : 'Issue with Id Verification');
    
    const content = isApproved ? `
      <h1 class="h1">${isRTL ? 'رائع! أنت موثق الآن' : 'Great! You are verified'}</h1>
      <p class="p">
          ${isRTL 
              ? 'لقد تمت مراجعة وثائق الشركة الخاصة بك وهي مطابقة لشروطنا. يمكنك الآن البدء بإرسال عروض الأسعار والمنافسة على الطلبات.' 
              : 'Your company documents have been reviewed and they match our requirements. You can now start bidding on requests and winning jobs.'}
      </p>
      <div class="button-container">
          <a href="${dashboardUrl}" class="button" style="background-color: #22c55e;">
              ${isRTL ? 'ابدأ العمل الآن' : 'Start Working Now'}
          </a>
      </div>
    ` : `
      <h1 class="h1">${isRTL ? 'نعتذر، لم يتم التوثيق' : 'Sorry, Verification Failed'}</h1>
      <p class="p">
          ${isRTL 
              ? 'بناءً على مراجعتنا، الوثائق التي قمت برفعها لم تكن مكتملة أو واضحة بما يكفي. يرجى إعادة رفع الوثائق المطلوبة مرة أخرى.' 
              : 'Based on our review, the documents you uploaded were incomplete or not clear enough. Please re-upload the required documents.'}
      </p>
      <div class="button-container">
          <a href="${dashboardUrl}/documents" class="button" style="background-color: #ef4444;">
              ${isRTL ? 'إعادة رفع الوثائق' : 'Re-upload Documents'}
          </a>
      </div>
    `;
  
    return {
      subject,
      html: renderBaseTemplate({ locale, title: subject }, content),
      text: subject + ': ' + dashboardUrl
    };
}

/**
 * 8. New Review Received
 */
export function getNewReviewEmailTemplate(
    companyName: string,
    rating: number,
    comment: string,
    locale: string = 'en'
  ): EmailTemplate {
    const isRTL = locale === 'ar';
    const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL || '#'}/${locale}/company/profile`;
    const subject = isRTL ? 'حصلت على تقييم جديد!' : 'You got a new review!';
    
    const content = `
      <h1 class="h1">${isRTL ? 'تهانينا! تقييم جديد' : 'Congrats! A new review'}</h1>
      <p class="p">
          ${isRTL 
              ? `ترك أحد الزبائن تقييماً لك بـ <strong>${rating} نجوم</strong>.` 
              : `A customer just rated your service with <strong>${rating} stars</strong>.`}
      </p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; font-style: italic; border: 1px solid #e2e8f0;">
          "${comment}"
      </div>
      <div class="button-container">
          <a href="${profileUrl}" class="button">
              ${isRTL ? 'مشاهدة التقييم' : 'View Review'}
          </a>
      </div>
    `;
  
    return {
      subject,
      html: renderBaseTemplate({ locale, title: subject }, content),
      text: `${isRTL ? 'تقييم جديد:' : 'New review:'} ${rating} stars. ${comment}`
    };
}

/**
 * 9. Request Status Update
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
 * 10. Existing User Guest Request Detection
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

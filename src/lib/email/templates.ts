import { ReactNode } from 'react';

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Email template for verification email
 */
export function getVerificationEmailTemplate(
  name: string,
  verificationUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';

  const subject = isRTL
    ? 'تأكيد بريدك الإلكتروني - سوق الخدمات'
    : 'Verify Your Email - Service Marketplace';

  const html = `
<!DOCTYPE html>
<html dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #1d4ed8;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
    .link {
      color: #2563eb;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}</div>
    </div>
    <div class="content">
      <h2>${isRTL ? 'مرحباً،' : 'Hello,'} ${name}</h2>
      <p>
        ${isRTL
      ? 'شكراً لتسجيلك في سوق الخدمات. للتحقق من بريدك الإلكتروني، يرجى النقر على الزر أدناه:'
      : 'Thank you for registering with Service Marketplace. To verify your email address, please click the button below:'}
      </p>
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">
          ${isRTL ? 'تأكيد البريد الإلكتروني' : 'Verify Email Address'}
        </a>
      </div>
      <p>
        ${isRTL
      ? 'إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:'
      : 'If the button doesn\'t work, you can copy and paste the following link into your browser:'}
      </p>
      <p><a href="${verificationUrl}" class="link">${verificationUrl}</a></p>
      <p>
        ${isRTL
      ? 'هذا الرابط صالح لمدة 24 ساعة. إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني.'
      : 'This link is valid for 24 hours. If you did not create an account, you can ignore this email.'}
      </p>
    </div>
    <div class="footer">
      <p>
        ${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}

${isRTL ? 'مرحباً،' : 'Hello,'} ${name}

${isRTL
      ? 'شكراً لتسجيلك في سوق الخدمات. للتحقق من بريدك الإلكتروني، يرجى زيارة الرابط التالي:'
      : 'Thank you for registering with Service Marketplace. To verify your email address, please visit the following link:'}

${verificationUrl}

${isRTL
      ? 'هذا الرابط صالح لمدة 24 ساعة. إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذا البريد الإلكتروني.'
      : 'This link is valid for 24 hours. If you did not create an account, you can ignore this email.'}

${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
  `;

  return { subject, html, text };
}

/**
 * Email template for welcome email (after verification)
 */
export function getWelcomeEmailTemplate(
  name: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';

  const subject = isRTL
    ? 'مرحباً بك في سوق الخدمات!'
    : 'Welcome to Service Marketplace!';

  const html = `
<!DOCTYPE html>
<html dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .features {
      background-color: #f8fafc;
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
    }
    .feature-item {
      margin: 10px 0;
      padding-${isRTL ? 'right' : 'left'}: 20px;
      position: relative;
    }
    .feature-item::before {
      content: "✓";
      position: absolute;
      ${isRTL ? 'right' : 'left'}: 0;
      color: #10b981;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}</div>
    </div>
    <div class="content">
      <h2>${isRTL ? 'مرحباً بك،' : 'Welcome,'} ${name}!</h2>
      <p>
        ${isRTL
      ? 'تم تأكيد بريدك الإلكتروني بنجاح. نحن سعداء بانضمامك إلى سوق الخدمات!'
      : 'Your email has been successfully verified. We\'re excited to have you join Service Marketplace!'}
      </p>
      <div class="features">
        <h3>${isRTL ? 'ما يمكنك فعله الآن:' : 'What you can do now:'}</h3>
        <div class="feature-item">
          ${isRTL ? 'نشر طلبات الخدمة والحصول على عروض أسعار' : 'Post service requests and get quotes'}
        </div>
        <div class="feature-item">
          ${isRTL ? 'استعراض الشركات وتقييم خدماتها' : 'Browse and review companies'}
        </div>
        <div class="feature-item">
          ${isRTL ? 'التواصل مباشرة مع مقدمي الخدمات' : 'Communicate directly with service providers'}
        </div>
        <div class="feature-item">
          ${isRTL ? 'إدارة مشاريعك بسهولة' : 'Manage your projects easily'}
        </div>
      </div>
      <div style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard" class="button">
          ${isRTL ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
        </a>
      </div>
    </div>
    <div class="footer">
      <p>
        ${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}

${isRTL ? 'مرحباً بك،' : 'Welcome,'} ${name}!

${isRTL
      ? 'تم تأكيد بريدك الإلكتروني بنجاح. نحن سعداء بانضمامك إلى سوق الخدمات!'
      : 'Your email has been successfully verified. We\'re excited to have you join Service Marketplace!'}

${isRTL ? 'ما يمكنك فعله الآن:' : 'What you can do now:'}
- ${isRTL ? 'نشر طلبات الخدمة والحصول على عروض أسعار' : 'Post service requests and get quotes'}
- ${isRTL ? 'استعراض الشركات وتقييم خدماتها' : 'Browse and review companies'}
- ${isRTL ? 'التواصل مباشرة مع مقدمي الخدمات' : 'Communicate directly with service providers'}
- ${isRTL ? 'إدارة مشاريعك بسهولة' : 'Manage your projects easily'}

${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard

${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
  `;

  return { subject, html, text };
}

/**
 * Email template for password reset
 */
export function getPasswordResetEmailTemplate(
  name: string,
  resetUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';

  const subject = isRTL
    ? 'إعادة تعيين كلمة المرور - سوق الخدمات'
    : 'Reset Your Password - Service Marketplace';

  const html = `
<!DOCTYPE html>
<html dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .warning {
      background-color: #fef3c7;
      border-${isRTL ? 'right' : 'left'}: 4px solid #f59e0b;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
    .link {
      color: #2563eb;
      word-break: break-all;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}</div>
    </div>
    <div class="content">
      <h2>${isRTL ? 'مرحباً،' : 'Hello,'} ${name}</h2>
      <p>
        ${isRTL
      ? 'لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. انقر على الزر أدناه لإعادة تعيين كلمة المرور:'
      : 'We received a request to reset your password. Click the button below to reset your password:'}
      </p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">
          ${isRTL ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}
        </a>
      </div>
      <div class="warning">
        <strong>${isRTL ? 'ملاحظة أمنية:' : 'Security Note:'}</strong>
        <p>
          ${isRTL
      ? 'هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني أو الاتصال بالدعم إذا كنت قلقاً.'
      : 'This link is valid for 1 hour only. If you did not request a password reset, please ignore this email or contact support if you have concerns.'}
        </p>
      </div>
      <p>
        ${isRTL
      ? 'إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في متصفحك:'
      : 'If the button doesn\'t work, you can copy and paste the following link into your browser:'}
      </p>
      <p><a href="${resetUrl}" class="link">${resetUrl}</a></p>
    </div>
    <div class="footer">
      <p>
        ${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}

${isRTL ? 'مرحباً،' : 'Hello,'} ${name}

${isRTL
      ? 'لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بك. يرجى زيارة الرابط التالي لإعادة تعيين كلمة المرور:'
      : 'We received a request to reset your password. Please visit the following link to reset your password:'}

${resetUrl}

${isRTL ? 'ملاحظة أمنية:' : 'Security Note:'}
${isRTL
      ? 'هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.'
      : 'This link is valid for 1 hour only. If you did not request a password reset, please ignore this email.'}

${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
  `;

  return { subject, html, text };
}

/**
 * Email template for existing users who create a new request as a guest
 */
export function getNewRequestForExistingUserTemplate(
  name: string,
  loginUrl: string,
  locale: string = 'en'
): EmailTemplate {
  const isRTL = locale === 'ar';

  const subject = isRTL
    ? 'لقد تم حفظ طلب الخدمة الخاص بك - سوق الخدمات'
    : 'Your Service Request was Saved - Service Marketplace';

  const html = `
<!DOCTYPE html>
<html dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 40px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #2563eb;
    }
    .content {
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background-color: #2563eb;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e5e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}</div>
    </div>
    <div class="content">
      <h2>${isRTL ? 'مرحباً،' : 'Hello,'} ${name}</h2>
      <p>
        ${isRTL
      ? 'لقد طلبتم خدمة جديدة للتو عبر منصتنا باستخدام هذا البريد الإلكتروني. بما أن لديكم حساب مسجل مسبقاً، تم ربط طلبكم بحسابكم بنجاح.'
      : 'You recently submitted a new service request using this email address. Since you already have an account, we have successfully linked your request to your account.'}
      </p>
      <p>
        ${isRTL
      ? 'يرجى تسجيل الدخول إلى حسابكم لمتابعة وتتبع طلب الخدمة أو مراجعة عروض الأسعار.'
      : 'Please log in to your account to track your service request or review quotes.'}
      </p>
      <div style="text-align: center;">
        <a href="${loginUrl}" class="button">
          ${isRTL ? 'تسجيل الدخول الآن' : 'Login Now'}
        </a>
      </div>
    </div>
    <div class="footer">
      <p>
        ${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
${isRTL ? 'سوق الخدمات' : 'Service Marketplace'}

${isRTL ? 'مرحباً،' : 'Hello,'} ${name}

${isRTL
      ? 'لقد طلبتم خدمة جديدة للتو عبر منصتنا باستخدام هذا البريد الإلكتروني. بما أن لديكم حساب مسجل مسبقاً، تم ربط طلبكم بحسابكم بنجاح.'
      : 'You recently submitted a new service request using this email address. Since you already have an account, we have successfully linked your request to your account.'}

${isRTL
      ? 'يرجى تسجيل الدخول إلى حسابكم لمتابعة وتتبع طلب الخدمة مراجعة عروض الأسعار:'
      : 'Please log in to your account to track your service request or review quotes:'}

${loginUrl}

${isRTL
      ? '© 2024 سوق الخدمات. جميع الحقوق محفوظة.'
      : '© 2024 Service Marketplace. All rights reserved.'}
  `;

  return { subject, html, text };
}

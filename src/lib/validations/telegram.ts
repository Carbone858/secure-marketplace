import { createHash, createHmac } from 'crypto';

/**
 * Verifies the integrity of data received from the Telegram Login Widget.
 * 
 * @param data The data object received from Telegram (must include 'hash')
 * @param botToken The bot token from @BotFather
 * @returns boolean indicating if the data is authentic
 */
export function verifyTelegramHash(data: Record<string, any>, botToken: string): boolean {
    const { hash, ...checkData } = data;
    
    if (!hash || !botToken) {
        console.error('[Telegram Auth Validation] Missing hash or botToken:', { hasHash: !!hash, hasToken: !!botToken });
        return false;
    }

    // Only include fields that are officially sent by Telegram Login Widget
    const telegramFields = ['id', 'first_name', 'last_name', 'username', 'photo_url', 'auth_date'];

    // 1. Create a data_check_string
    // Sort keys alphabetically and join them as key=value\n
    const checkString = Object.keys(checkData)
        .filter(key => telegramFields.includes(key))
        .sort()
        .map(key => `${key}=${checkData[key]}`)
        .join('\n');

    // 2. Secret key is SHA256 of the bot token
    const secretKey = createHash('sha256').update(botToken).digest();

    // 3. HMAC-SHA256 of data_check_string using the secret key
    const hmac = createHmac('sha256', secretKey)
        .update(checkString)
        .digest('hex');

    console.log('[Telegram Auth Validation] Debug Info:', {
        tokenLength: botToken.length,
        tokenPreview: botToken.substring(0, 6) + '...' + botToken.substring(botToken.length - 6),
        checkString: checkString.replace(/\n/g, '\\n'),
        receivedHash: hash,
        calculatedHmac: hmac,
        matches: hmac === hash
    });

    // 4. Compare with the received hash
    return hmac === hash;
}

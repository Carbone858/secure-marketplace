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
    
    if (!hash || !botToken) return false;

    // 1. Create a data_check_string
    // Sort keys alphabetically and join them as key=value\n
    const checkString = Object.keys(checkData)
        .sort()
        .map(key => `${key}=${checkData[key]}`)
        .join('\n');

    // 2. Secret key is SHA256 of the bot token
    const secretKey = createHash('sha256').update(botToken).digest();

    // 3. HMAC-SHA256 of data_check_string using the secret key
    const hmac = createHmac('sha256', secretKey)
        .update(checkString)
        .digest('hex');

    // 4. Compare with the received hash
    return hmac === hash;
}

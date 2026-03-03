const fs = require('fs');

try {
    let arData = JSON.parse(fs.readFileSync('messages/ar.json', 'utf8'));
    let enData = JSON.parse(fs.readFileSync('messages/en.json', 'utf8'));

    if (!arData.company_dashboard) arData.company_dashboard = {};
    if (!enData.company_dashboard) enData.company_dashboard = {};

    arData.company_dashboard.messagesShortcut = 'الرسائل';
    enData.company_dashboard.messagesShortcut = 'Messages';

    fs.writeFileSync('messages/ar.json', JSON.stringify(arData, null, 2), 'utf8');
    fs.writeFileSync('messages/en.json', JSON.stringify(enData, null, 2), 'utf8');
    console.log('SUCCESSLY TRANSLATED SHORTCUT');
} catch (e) {
    console.error(e);
}

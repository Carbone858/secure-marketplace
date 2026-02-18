
async function check(locale) {
    try {
        const url = `http://localhost:3000/api/requests${locale ? '?locale=' + locale : ''}`;
        console.log(`Checking ${url}...`);
        const res = await fetch(url);
        const data = await res.json();
        const reqs = data.data?.requests || [];
        console.log(`Found ${reqs.length} requests.`);
        if (reqs.length > 0) {
            console.log('Sample Title:', reqs[0].title);
            console.log('Sample Tags:', reqs[0].tags);
        } else {
            console.log('No requests found.');
        }
    } catch (e) {
        console.error(e);
    }
}

async function main() {
    await check('en');
    await check('ar');
    await check(); // mixed
}

main();

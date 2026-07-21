import sitemap from '../src/app/sitemap';

async function run() {
  console.log('--- TESTING SITEMAP GENERATION ---');
  try {
    const result = await sitemap();
    console.log('Total URLs generated:', result.length);
    console.log('First 10 URLs:');
    console.log(JSON.stringify(result.slice(0, 10), null, 2));
    console.log('Sample URL paths:');
    const urls = result.map(entry => entry.url);
    console.log(urls.slice(0, 20));
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
}

run();

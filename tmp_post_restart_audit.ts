
import { checkDatabase, checkApiEndpoints } from './src/lib/monitoring/checker';

async function quickAudit() {
    console.log('--- Quick Performance Audit (Post-Restart) ---');
    
    console.log('Testing DB...');
    const dbResult = await checkDatabase();
    console.log(`DB Status: ${dbResult.status}, Latency: ${dbResult.latencyMs}ms`);

    console.log('Testing API Endpoints...');
    const apiResults = await checkApiEndpoints();
    console.table(apiResults.map(r => ({
        endpoint: r.service,
        status: r.status,
        latency: `${r.latencyMs}ms`,
        status_code: r.statusCode
    })));
}

quickAudit().catch(console.error);

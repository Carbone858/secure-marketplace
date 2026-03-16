import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const company = await prisma.company.findFirst();
  const user = await prisma.user.findFirst({ where: { role: 'USER' } });

  if (!company || !user) {
    console.error('No company or user found');
    return;
  }

  console.log('Using Company:', company.id);
  console.log('Using User:', user.email);

  // We can't easily call the API with auth from here without a token
  // But we can check if the endpoint is reachable at all by sending a request
  // even if it returns 401, we should see the "CALLED" log because I put it BEFORE auth.

  const url = `http://localhost:3000/api/companies/${company.id}/reviews`;
  console.log('Fetching:', url);

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ rating: 5, comment: 'Test from script' }),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

main();

import { NextResponse } from 'next/server';
import { seedDatabase } from '@/scripts/seed';

export async function GET() {
  try {
    const result = await seedDatabase();
    return NextResponse.json({ ...result, message: 'Database seeded successfully via GET' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

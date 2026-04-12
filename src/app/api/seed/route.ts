import { NextResponse } from 'next/server';
import { seedDatabase } from '@/scripts/seed';

export async function POST() {
  try {
    const result = await seedDatabase();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

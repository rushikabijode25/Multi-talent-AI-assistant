import { NextRequest, NextResponse } from 'next/server';
import { getDashboardConfig } from '@/services/adminService';
import { getSessionUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = await params;

    const config = await getDashboardConfig(slug, user._id.toString());
    
    return NextResponse.json(config);
  } catch (error: any) {
    if (error.message === 'Access denied' || error.message === 'Admin access denied') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { processChatMessage } from '@/services/chatService';
import { z } from 'zod';
import { getAuthorizedProjectBySlug } from '@/services/projectService';

// Zod schema for input validation
const chatInputSchema = z.object({
  productInstanceId: z.string(),
  conversationId: z.string(),
  message: z.string().min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await params;
    
    // Authorization Check
    const project = await getAuthorizedProjectBySlug(slug, user._id.toString());
    if (!project) return NextResponse.json({ error: 'Access denied' }, { status: 403 });

    // Validate request body
    const body = await request.json();
    const validated = chatInputSchema.parse(body);

    const result = await processChatMessage(
      project._id.toString(),
      validated.productInstanceId,
      validated.conversationId,
      validated.message
    );

    return NextResponse.json(result);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Validation Error', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

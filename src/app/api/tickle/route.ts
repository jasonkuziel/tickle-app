import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { receiverId } = await req.json();

    if (!receiverId) {
      return NextResponse.json(
        { error: 'Missing receiverId' },
        { status: 400 }
      );
    }

    const giverId = session.user.id;

    // Check if giver and receiver are the same
    if (giverId === receiverId) {
      return NextResponse.json(
        { error: 'You cannot tickle yourself' },
        { status: 400 }
      );
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check 24-hour cooldown
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const lastTickle = await prisma.tickle.findFirst({
      where: {
        giverId,
        receiverId,
        createdAt: {
          gte: oneDayAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (lastTickle) {
      // Calculate hours remaining
      const now = new Date();
      const tickleTime = new Date(lastTickle.createdAt);
      const diffMs = now.getTime() - tickleTime.getTime();
      const diffHours = Math.ceil((24 * 60 * 60 * 1000 - diffMs) / (60 * 60 * 1000));

      return NextResponse.json(
        {
          error: 'You already tickled this user recently',
          cooldownRemaining: Math.max(1, diffHours),
        },
        { status: 429 }
      );
    }

    // Create tickle
    await prisma.tickle.create({
      data: {
        giverId,
        receiverId,
      },
    });

    // Get updated count
    const count = await prisma.tickle.count({
      where: { receiverId },
    });

    return NextResponse.json({
      message: 'Tickled successfully!',
      count,
    });
  } catch (error) {
    console.error('Tickle error:', error);
    return NextResponse.json(
      { error: 'Failed to tickle' },
      { status: 500 }
    );
  }
}

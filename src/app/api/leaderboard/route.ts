import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const leaderboard = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        ticklesReceived: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        ticklesReceived: {
          _count: 'desc',
        },
      },
      take: 20,
    });

    return NextResponse.json({
      users: leaderboard.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        tickleCount: user.ticklesReceived.length,
      })),
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

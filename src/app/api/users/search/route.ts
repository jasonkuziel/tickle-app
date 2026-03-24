import { prisma } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q');

    if (!q || q.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query required' },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { username: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
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
      take: 20,
    });

    return NextResponse.json({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        username: user.username,
        image: user.image,
        tickleCount: user.ticklesReceived.length,
      })),
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search users' },
      { status: 500 }
    );
  }
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Delete existing data
  await prisma.tickle.deleteMany();
  await prisma.user.deleteMany();

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create demo users
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
      username: 'alice',
      password: hashedPassword,
      bio: 'Love tickling people! 🤣',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
      username: 'bob',
      password: hashedPassword,
      bio: 'Always up for a good tickle',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      name: 'Charlie',
      email: 'charlie@example.com',
      username: 'charlie',
      password: hashedPassword,
      bio: 'Tickle enthusiast',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    },
  });

  const diana = await prisma.user.create({
    data: {
      name: 'Diana',
      email: 'diana@example.com',
      username: 'diana',
      password: hashedPassword,
      bio: 'Spreading tickles and joy',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
    },
  });

  const evan = await prisma.user.create({
    data: {
      name: 'Evan',
      email: 'evan@example.com',
      username: 'evan',
      password: hashedPassword,
      bio: 'Tickle master',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=evan',
    },
  });

  // Create sample tickles
  const now = new Date();
  const tickles = [
    { giverId: alice.id, receiverId: bob.id, createdAt: new Date(now.getTime() - 1000 * 60 * 5) },
    { giverId: bob.id, receiverId: alice.id, createdAt: new Date(now.getTime() - 1000 * 60 * 10) },
    { giverId: charlie.id, receiverId: diana.id, createdAt: new Date(now.getTime() - 1000 * 60 * 15) },
    { giverId: diana.id, receiverId: charlie.id, createdAt: new Date(now.getTime() - 1000 * 60 * 20) },
    { giverId: evan.id, receiverId: alice.id, createdAt: new Date(now.getTime() - 1000 * 60 * 25) },
    { giverId: alice.id, receiverId: charlie.id, createdAt: new Date(now.getTime() - 1000 * 60 * 30) },
    { giverId: bob.id, receiverId: diana.id, createdAt: new Date(now.getTime() - 1000 * 60 * 35) },
    { giverId: charlie.id, receiverId: evan.id, createdAt: new Date(now.getTime() - 1000 * 60 * 40) },
    { giverId: diana.id, receiverId: bob.id, createdAt: new Date(now.getTime() - 1000 * 60 * 45) },
    { giverId: evan.id, receiverId: diana.id, createdAt: new Date(now.getTime() - 1000 * 60 * 50) },
  ];

  for (const tickle of tickles) {
    await prisma.tickle.create({
      data: tickle,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`Created 5 users and 10 tickles`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

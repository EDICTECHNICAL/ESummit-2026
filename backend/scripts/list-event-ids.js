const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function check() {
  try {
    const events = await prisma.event.findMany({
      where: { eventId: { contains: 'ai' } },
      select: { eventId: true, title: true }
    });
    console.log('AI-related events:');
    events.forEach(e => console.log('"' + e.eventId + '",'));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
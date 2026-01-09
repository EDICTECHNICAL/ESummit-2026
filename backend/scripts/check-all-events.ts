import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkEvents() {
  try {
    const events = await prisma.event.findMany({
      select: {
        eventId: true,
        title: true
      },
      orderBy: {
        eventId: 'asc'
      }
    });

    console.log(`Total events: ${events.length}`);
    console.log('\nAll events:');
    events.forEach(event => {
      console.log(`${event.eventId} - ${event.title}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// The starting allowlist of legitimate, non-sexual activity categories
// (Master Development Prompt §6, part 1). Admins can add more later via
// the Phase 10 admin panel — partners can never free-type a new one.
const CATEGORIES = [
  { name: 'Hiking / Trekking Companion', slug: 'hiking-trekking' },
  { name: 'Travel Companion', slug: 'travel-companion' },
  { name: 'Event / Wedding Plus-One', slug: 'event-plus-one' },
  { name: 'Movie / Dinner Companion', slug: 'movie-dinner-companion' },
  { name: 'Shopping Companion', slug: 'shopping-companion' },
  { name: 'Local City Exploration', slug: 'city-exploration' },
  { name: 'Tour / Activity Companion', slug: 'tour-activity-companion' },
  { name: 'Gaming Companion', slug: 'gaming-companion' },
  { name: 'Sports / Activity Partner', slug: 'sports-activity-partner' },
  { name: 'Study / Coworking Companion', slug: 'study-coworking-companion' },
  { name: 'Social / Friendship Activities', slug: 'social-friendship' },
  { name: 'Elderly Companionship', slug: 'elderly-companionship' },
  { name: 'Event / Appointment Assistance', slug: 'appointment-assistance' },
];

async function main() {
  for (const category of CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, isActive: true },
      create: category,
    });
  }
  // eslint-disable-next-line no-console
  console.log(`Seeded ${CATEGORIES.length} service categories.`);

  // Dev convenience only — admins are never self-registerable through the
  // public API (registration always defaults to role USER); this is the
  // one sanctioned way to get a first ADMIN account without hand-editing
  // the database. Only runs if both env vars are explicitly set.
  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'ADMIN' },
      create: {
        fullName: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
        verificationStatus: 'VERIFIED',
      },
    });
    // eslint-disable-next-line no-console
    console.log(`Seeded admin account: ${adminEmail}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(
      'SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — skipping admin seed. ' +
        'Set both to create a dev admin account on next `prisma db seed`.'
    );
  }
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

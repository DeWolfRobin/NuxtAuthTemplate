// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const roundsOfHashing = 10;

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  const passwordAlice = await bcrypt.hash('password-alice', roundsOfHashing);
  const passwordBob = await bcrypt.hash('password-bob', roundsOfHashing);

  const user1 = await prisma.users.upsert({
    where: { email: 'alice' },
    update: {
      password: passwordAlice,
    },
    create: {
      email: 'alice',
      name: 'alice',
      password: passwordAlice,
    },
  });

  const user2 = await prisma.users.upsert({
    where: { email: 'bob' },
    update: {
      password: passwordBob,
    },
    create: {
      email: 'bob',
      name: 'bob',
      password: passwordBob,
    },
  });

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

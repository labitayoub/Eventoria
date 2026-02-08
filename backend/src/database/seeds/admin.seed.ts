import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '../../users/entities/user.entity';

config();

async function seedAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('Database connected.');

  const userRepository = dataSource.getRepository(User);

  const adminEmail = 'ayoub@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD is not set in the environment variables.');
    await dataSource.destroy();
    process.exit(1);
  }

  const existingAdmin = await userRepository.findOne({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user "${adminEmail}" already exists. Skipping seed.`);
    await dataSource.destroy();
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = userRepository.create({
    email: adminEmail,
    password: hashedPassword,
    firstName: 'Ayoub',
    lastName: 'Admin',
    role: UserRole.ADMIN,
  });

  await userRepository.save(admin);
  console.log(`Admin user "${adminEmail}" created successfully.`);

  await dataSource.destroy();
}

seedAdmin().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});

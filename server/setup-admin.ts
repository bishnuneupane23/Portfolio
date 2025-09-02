import bcrypt from 'bcrypt';
import { storage } from './storage';

async function createDefaultAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await storage.getAdminUserByUsername('admin');
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await storage.createAdminUser({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword
    });

    console.log('Default admin user created successfully');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Please change these credentials after first login');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDefaultAdmin();
}

export { createDefaultAdmin };
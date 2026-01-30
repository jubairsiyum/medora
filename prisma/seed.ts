import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth/password';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create Admin User
  console.log('Creating admin user...');
  const adminPassword = await hashPassword('Admin@123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@medora.com' },
    update: {},
    create: {
      email: 'admin@medora.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  // Create Test Customer
  console.log('Creating test customer...');
  const customerPassword = await hashPassword('Test@123');
  const customer = await prisma.user.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      email: 'customer@test.com',
      phone: '01712345678',
      name: 'Test Customer',
      password: customerPassword,
      role: 'CUSTOMER',
      address: '123 Test Street',
      city: 'Dhaka',
      state: 'Dhaka',
      zipCode: '1200',
    },
  });

  // Create Categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'pain-relief' },
      update: {},
      create: {
        name: 'Pain Relief',
        slug: 'pain-relief',
        description: 'Medicines for pain management and relief',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cold-flu' },
      update: {},
      create: {
        name: 'Cold & Flu',
        slug: 'cold-flu',
        description: 'Medicines for cold and flu symptoms',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'diabetes' },
      update: {},
      create: {
        name: 'Diabetes Care',
        slug: 'diabetes',
        description: 'Medicines and supplies for diabetes management',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vitamins' },
      update: {},
      create: {
        name: 'Vitamins & Supplements',
        slug: 'vitamins',
        description: 'Vitamins, minerals, and nutritional supplements',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'antibiotics' },
      update: {},
      create: {
        name: 'Antibiotics',
        slug: 'antibiotics',
        description: 'Antibiotic medications for bacterial infections',
      },
    }),
  ]);

  // Create Brands
  console.log('Creating brands...');
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'square' },
      update: {},
      create: {
        name: 'Square Pharmaceuticals',
        slug: 'square',
        description: 'Leading pharmaceutical company in Bangladesh',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'beximco' },
      update: {},
      create: {
        name: 'Beximco Pharmaceuticals',
        slug: 'beximco',
        description: 'Trusted pharmaceutical brand',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'incepta' },
      update: {},
      create: {
        name: 'Incepta Pharmaceuticals',
        slug: 'incepta',
        description: 'Quality medicines you can trust',
      },
    }),
  ]);

  // Create Sample Medicines
  console.log('Creating medicines...');
  const medicines = [
    {
      name: 'Napa 500mg Tablet',
      slug: 'napa-500mg-tablet',
      genericName: 'Paracetamol',
      description: 'Napa is used for the relief of mild to moderate pain and fever.',
      dosage: '500mg',
      form: 'Tablet',
      strength: '500mg',
      packSize: '10 tablets',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      price: 2.5,
      stock: 1000,
      prescriptionRequired: false,
      featured: true,
      categoryId: categories[0].id,
      brandId: brands[1].id,
      images: ['/images/medicines/napa.jpg'],
      uses: 'Used to relieve pain from headache, toothache, menstrual pain, backache, and cold/flu symptoms. Also used to reduce fever.',
      sideEffects: 'Rare side effects may include skin rash, allergic reactions. Overdose can cause liver damage.',
      warnings: 'Do not exceed recommended dose. Not recommended for patients with severe liver disease.',
      interactions: 'May interact with warfarin and other blood thinners.',
      contraindications: 'Hypersensitivity to paracetamol, severe hepatic impairment.',
      sku: 'NAPA-500-TAB',
      barcode: '8941100123456',
    },
    {
      name: 'Ace 100mg Tablet',
      slug: 'ace-100mg-tablet',
      genericName: 'Aspirin',
      description: 'Ace is used to reduce pain, fever, and inflammation.',
      dosage: '100mg',
      form: 'Tablet',
      strength: '100mg',
      packSize: '10 tablets',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      price: 3.0,
      stock: 800,
      prescriptionRequired: false,
      featured: true,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      images: ['/images/medicines/ace.jpg'],
      uses: 'Used to reduce fever and relieve mild to moderate pain from conditions such as muscle aches, toothaches, common cold, and headaches.',
      sideEffects: 'May cause stomach upset, heartburn, drowsiness, and mild headache.',
      warnings: 'May increase risk of bleeding. Avoid if you have stomach ulcers.',
      interactions: 'May interact with blood thinners, NSAIDs, and other medications.',
      contraindications: 'Active peptic ulcer, bleeding disorders, aspirin allergy.',
      sku: 'ACE-100-TAB',
      barcode: '8941100234567',
    },
    {
      name: 'Histacin 10mg Tablet',
      slug: 'histacin-10mg-tablet',
      genericName: 'Cetirizine Hydrochloride',
      description: 'Histacin is an antihistamine used to relieve allergy symptoms.',
      dosage: '10mg',
      form: 'Tablet',
      strength: '10mg',
      packSize: '10 tablets',
      manufacturer: 'Incepta Pharmaceuticals Ltd.',
      price: 5.0,
      stock: 600,
      prescriptionRequired: false,
      featured: true,
      categoryId: categories[1].id,
      brandId: brands[2].id,
      images: ['/images/medicines/histacin.jpg'],
      uses: 'Used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching.',
      sideEffects: 'May cause drowsiness, dry mouth, stomach pain, diarrhea, or vomiting.',
      warnings: 'May cause drowsiness. Avoid driving or operating machinery.',
      interactions: 'May interact with sedatives and other antihistamines.',
      contraindications: 'Severe kidney disease, hypersensitivity to cetirizine.',
      sku: 'HIST-10-TAB',
      barcode: '8941100345678',
    },
    {
      name: 'Sergel 20mg Capsule',
      slug: 'sergel-20mg-capsule',
      genericName: 'Omeprazole',
      description: 'Sergel reduces stomach acid production and is used to treat acid reflux.',
      dosage: '20mg',
      form: 'Capsule',
      strength: '20mg',
      packSize: '14 capsules',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      price: 8.0,
      stock: 500,
      prescriptionRequired: true,
      featured: false,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      images: ['/images/medicines/sergel.jpg'],
      uses: 'Used to treat gastroesophageal reflux disease (GERD), stomach ulcers, and excessive stomach acid production.',
      sideEffects: 'Headache, nausea, diarrhea, stomach pain, gas, constipation.',
      warnings: 'Long-term use may increase risk of bone fractures and vitamin B12 deficiency.',
      interactions: 'May interact with clopidogrel, warfarin, and certain antifungal medications.',
      contraindications: 'Hypersensitivity to omeprazole or other proton pump inhibitors.',
      sku: 'SERG-20-CAP',
      barcode: '8941100456789',
    },
    {
      name: 'Amoxi 500mg Capsule',
      slug: 'amoxi-500mg-capsule',
      genericName: 'Amoxicillin',
      description: 'Amoxi is an antibiotic used to treat bacterial infections.',
      dosage: '500mg',
      form: 'Capsule',
      strength: '500mg',
      packSize: '15 capsules',
      manufacturer: 'Beximco Pharmaceuticals Ltd.',
      price: 12.0,
      stock: 400,
      prescriptionRequired: true,
      featured: false,
      categoryId: categories[4].id,
      brandId: brands[1].id,
      images: ['/images/medicines/amoxi.jpg'],
      uses: 'Used to treat a wide variety of bacterial infections including ear, nose, throat, urinary tract, and skin infections.',
      sideEffects: 'Nausea, vomiting, diarrhea, rash, and allergic reactions.',
      warnings: 'Complete the full course even if symptoms improve. Do not use for viral infections.',
      interactions: 'May interact with oral contraceptives and other antibiotics.',
      contraindications: 'Penicillin allergy, infectious mononucleosis.',
      sku: 'AMOX-500-CAP',
      barcode: '8941100567890',
    },
    {
      name: 'Vitamin C 500mg Tablet',
      slug: 'vitamin-c-500mg-tablet',
      genericName: 'Ascorbic Acid',
      description: 'Essential vitamin for immune system support and overall health.',
      dosage: '500mg',
      form: 'Tablet',
      strength: '500mg',
      packSize: '30 tablets',
      manufacturer: 'Square Pharmaceuticals Ltd.',
      price: 6.0,
      stock: 900,
      prescriptionRequired: false,
      featured: true,
      categoryId: categories[3].id,
      brandId: brands[0].id,
      images: ['/images/medicines/vitamin-c.jpg'],
      uses: 'Used to prevent and treat vitamin C deficiency, boost immune system, and support overall health.',
      sideEffects: 'May cause stomach upset, diarrhea, or kidney stones in high doses.',
      warnings: 'Do not exceed recommended dose. Consult doctor if pregnant or breastfeeding.',
      interactions: 'May interact with blood thinners and certain chemotherapy drugs.',
      contraindications: 'Kidney disease, history of kidney stones.',
      sku: 'VITC-500-TAB',
      barcode: '8941100678901',
    },
  ];

  for (const medicineData of medicines) {
    await prisma.medicine.upsert({
      where: { slug: medicineData.slug },
      update: {},
      create: medicineData,
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('Admin:');
  console.log('  Email: admin@medora.com');
  console.log('  Password: Admin@123');
  console.log('\nCustomer:');
  console.log('  Email: customer@test.com');
  console.log('  Password: Test@123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

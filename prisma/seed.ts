import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // ১. Positions Data Array
  const positions = [
    { "title": "Full-Stack Web Engineer", "description": "Responsible for building end-to-end web applications.", "isActive": true },
    { "title": "Frontend Developer (React)", "description": "Focuses on building rich UI using React and TypeScript.", "isActive": false },
    { "title": "Backend Engineer (NestJS)", "description": "Designing scalable APIs and database architectures.", "isActive": true },
    { "title": "DevOps Specialist", "description": "Managing AWS infrastructure and CI/CD pipelines.", "isActive": true },
    { "title": "Mobile App Developer (Flutter)", "description": "Building cross-platform mobile apps for iOS and Android.", "isActive": false },
    { "title": "UI/UX Designer", "description": "Creating wireframes, prototypes, and user interfaces.", "isActive": true },
    { "title": "QA Automation Engineer", "description": "Writing automation test suites using Cypress and Playwright.", "isActive": true },
    { "title": "Data Scientist", "description": "Building machine learning models and data pipelines.", "isActive": false },
    { "title": "Product Manager", "description": "Defining product roadmap and coordinating features.", "isActive": true },
    { "title": "Cybersecurity Analyst", "description": "Ensuring application security and compliance.", "isActive": true },
    { "title": "Cloud Architect", "description": "Designing enterprise-grade cloud solutions.", "isActive": false },
    { "title": "Solutions Engineer", "description": "Bridging technical teams and enterprise clients.", "isActive": true },
    { "title": "Database Administrator", "description": "Optimizing PostgreSQL databases and queries.", "isActive": true },
    { "title": "Technical Writer", "description": "Documenting APIs, architectures, and user guides.", "isActive": false },
    { "title": "Scrum Master", "description": "Facilitating agile methodologies and team sprints.", "isActive": true },
    { "title": "AI/ML Engineer", "description": "Fine-tuning LLMs and integration with applications.", "isActive": true },
    { "title": "Blockchain Developer", "description": "Developing smart contracts and Web3 apps.", "isActive": false },
    { "title": "Site Reliability Engineer (SRE)", "description": "Ensuring high availability of production services.", "isActive": true },
    { "title": "SEO Specialist", "description": "Optimizing web platforms for search engine visibility.", "isActive": true },
    { "title": "Systems Administrator", "description": "Managing internal network and server hardware.", "isActive": false }
  ];

  // ২. Attributes Data Array
  const attributes = [
    { label: "Full Name", type: "TEXT", isBuiltIn: true },
    { label: "Email Address", type: "TEXT", isBuiltIn: true },
    { label: "Phone Number", type: "TEXT", isBuiltIn: true },
    { label: "Profile Photo", type: "TEXT", isBuiltIn: true },
    { label: "GitHub Profile URL", type: "TEXT", isBuiltIn: false },
    { label: "LinkedIn Profile URL", type: "TEXT", isBuiltIn: false },
    { label: "Portfolio Website", type: "TEXT", isBuiltIn: false },
    { label: "Years of Experience", type: "NUMBER", isBuiltIn: false },
    { label: "Expected Salary (BDT)", type: "NUMBER", isBuiltIn: false },
    { label: "Current CTC (BDT)", type: "NUMBER", isBuiltIn: false },
    { label: "Notice Period (Days)", type: "NUMBER", isBuiltIn: false },
    { label: "IELTS Band Score", type: "NUMBER", isBuiltIn: false },
    { label: "Remote Work Availability", type: "BOOLEAN", isBuiltIn: false },
    { label: "Relocation Availability", type: "BOOLEAN", isBuiltIn: false },
    { label: "Has Driving License", type: "BOOLEAN", isBuiltIn: false },
    { label: "Highest Degree Obtained", type: "TEXT", isBuiltIn: false },
    { label: "Primary Tech Stack", type: "TEXT", isBuiltIn: false },
    { label: "Certifications (e.g. AWS, PMP)", type: "TEXT", isBuiltIn: false },
    { label: "Present Address", type: "TEXT", isBuiltIn: false },
    { label: "Permanent Address", type: "TEXT", isBuiltIn: false }
  ];

  // ৩. Attribute Library Seeding (Using upsert to prevent duplicates)
  console.log('Seeding attribute library...');
  for (const attr of attributes) {
    await prisma.attributeLibrary.upsert({
      where: { label: attr.label },
      update: {}, 
      create: attr, 
    });
  }
  console.log('Attribute library seeded successfully!');

  // ৪. Positions Seeding
  console.log('Seeding positions...');
  for (const pos of positions) {
    // পজিশন টেবিলে ইউনিক কনস্ট্রেইন্ট না থাকলে সরাসরি ক্রিয়েট করা নিরাপদ, 
    // তবে বার বার সিড রান করলে ডুপ্লিকেট এড়াতে আমরা এখানে একটি ফাইন্ড চেক রাখতে পারি।
    const existingPosition = await prisma.position.findFirst({
      where: { title: pos.title }
    });
    
    if (!existingPosition) {
      await prisma.position.create({
        data: {
          title: pos.title,
          description: pos.description,
          isActive: pos.isActive,
          version: 1
        },
      });
    }
  }
  console.log('Positions seeded successfully!');
  console.log('All seed data inserted successfully! 🌱');
}

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })
  .finally(async () => { 
    await prisma.$disconnect(); 
  });
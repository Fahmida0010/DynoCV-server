import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
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
]

  for (const pos of positions) {
    await prisma.position.create({
      data: pos,
    });
  }
  console.log('Seed data inserted successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
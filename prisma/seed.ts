import { PrismaClient } from '@prisma/client';
import { attributes } from './data/attributes';
import  {positions} from "./data/positions"
import { cvContents } from './data/cvs';
import { likesData } from './data/likesData';
import { userAttributes } from './data/userAttributes';


const prisma = new PrismaClient();

async function main() {
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

  // ৫. CV Seeding 
  console.log('Seeding CV snapshots...');
  const targetUserId = 'cmr9pe5lg0000tapojbmu5b5f'; 

  
  const dbPositions = await prisma.position.findMany({ where: { isActive: true } });

  for (let i = 0; i < cvContents.length; i++) {
    const item = cvContents[i];
    
    
    const matchedPosition = dbPositions[item.posIndex];

    if (matchedPosition) {
      try {
        await prisma.cV.upsert({
          where: {
            userId_positionId: {
              userId: targetUserId,
              positionId: matchedPosition.id,
            },
          },
          update: {
            content: item.content,
          },
          create: {
            userId: targetUserId,
            positionId: matchedPosition.id,
            content: item.content,
          },
        });
      } catch (error) {
        console.error(`Error seeding CV at index ${i}:`, error);
      }
    }
  }
  console.log('CV snapshots seeded successfully!');


    const createdLikes = await prisma.like.createMany({
      data: likesData,
      skipDuplicates: true, 
    });

   
 //user attrinutes
  console.log('Seeding User Attributes...');
  const dbAttributes = await prisma.attributeLibrary.findMany();

  for (const mockAttr of userAttributes) {
    // mockAttr.label এর চেকটি বাদ দিয়ে শুধু আইডি ম্যাচ করানো হলো
    const matchedLibraryAttr = dbAttributes.find(
      (dbAttr) => dbAttr.id === mockAttr.attributeId
    );

    if (matchedLibraryAttr) {
      try {
        await prisma.userAttribute.upsert({
          where: {
            userId_attributeId: {
              userId: targetUserId,
              attributeId: matchedLibraryAttr.id,
            },
          },
          update: { value: mockAttr.value },
          create: {
            userId: targetUserId,
            attributeId: matchedLibraryAttr.id,
            value: mockAttr.value,
            version: 1,
          },
        });
      } catch (error) {
        console.error(`Error seeding UserAttribute:`, error);
      }
    }
  }
  console.log('User Attributes seeded successfully!');
    console.log(`${createdLikes.count} likes seeded successfully!`);
  }
  console.log('All seed data inserted successfully! 🌱');
  

main()
  .catch((e) => { 
    console.error(e); 
    process.exit(1); 
  })


  .finally(async () => { 
    await prisma.$disconnect(); 
  });
import { PrismaClient } from '@prisma/client';
import { attributes } from './data/attributes';
import  {positions} from "./data/positions"
import { cvContents } from './data/cvs';
import { likesData } from './data/likesData';


const prisma = new PrismaClient();

async function main() {
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

  // ৫. CV Seeding (২০টি ডাইনামিক CV কন্টেন্ট আপনার নির্দিষ্ট ইউজারের জন্য)
  console.log('Seeding CV snapshots...');
  const targetUserId = 'cmr9pe5lg0000tapojbmu5b5f'; // আপনার ক্যান্ডিডেট ইউজার আইডি

  // ডাটাবেজে সদ্য তৈরি হওয়া বা আগে থেকে থাকা পজিশনগুলোর আইডি ম্যাপ করে নেওয়া
  const dbPositions = await prisma.position.findMany({ where: { isActive: true } });

  for (let i = 0; i < cvContents.length; i++) {
    const item = cvContents[i];
    
    // positions.ts ফাইলের ইনডেক্স অনুযায়ী ডাটাবেজের পজিশন ম্যাচ করানো
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


  // লাইকগুলো ডাটাবেজে পুশ করা হচ্ছে
    const createdLikes = await prisma.like.createMany({
      data: likesData,
      skipDuplicates: true, // ডুপ্লিকেট লাইক হলে এরর না দিয়ে স্কিপ করবে
    });

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
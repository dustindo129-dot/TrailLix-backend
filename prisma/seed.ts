import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { lessons } from '../src/data/lessons';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TRAILIX database seed...');

  // Create test users for AI learning system
  const hashedPassword = await bcrypt.hash('Test123!@#', 10);

  // Create Student User with some progress
  const student = await prisma.user.upsert({
    where: { email: 'john@trailix.com' },
    update: {},
    create: {
      email: 'john@trailix.com',
      name: 'John Doe',
      role: Role.STUDENT,
      password_hash: hashedPassword,
      email_verified: true,
      // Gamification data
      xp: 250,
      level: 2,
      streak: 3,
      longest_streak: 5,
      // Personalization data
      age_range: '25-34',
      role_description: 'Software Developer',
      ai_experience: 'Basic',
      skills: ['Programming', 'AI', 'Writing'],
      achievement: 'Build AI projects',
      fields: ['Technology', 'Education'],
      motivations: ['Career growth', 'Curiosity'],
      course_start_date: new Date(),
      has_seen_concepts_intro: true,
      free_lessons_used: 2,
    },
  });
  console.log('✅ Created student user:', student.email);

  // Create New User (needs onboarding)
  const newUser = await prisma.user.upsert({
    where: { email: 'jane@trailix.com' },
    update: {},
    create: {
      email: 'jane@trailix.com',
      name: 'Jane Smith',
      role: Role.STUDENT,
      password_hash: hashedPassword,
      email_verified: true,
      // Fresh user - no progress yet
    },
  });
  console.log('✅ Created new user (needs onboarding):', newUser.email);

  // Seed AI Lessons from lessons.ts
  console.log('📚 Seeding AI lessons...');
  
  let seedCount = 0;
  for (const lesson of lessons.slice(0, 5)) { // Seed first 5 lessons
    if (lesson.id === 0) continue; // Skip welcome lesson
    
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {
        title_en: lesson.content.en.title,
        title_vi: lesson.content.vi.title,
        category_en: lesson.content.en.category,
        category_vi: lesson.content.vi.category,
        order_index: lesson.id,
      },
      create: {
        id: lesson.id,
        title_en: lesson.content.en.title,
        title_vi: lesson.content.vi.title,
        category_en: lesson.content.en.category,
        category_vi: lesson.content.vi.category,
        order_index: lesson.id,
      },
    });
    seedCount++;
  }
  console.log(`✅ Seeded ${seedCount} AI lessons`);

  // Create sample AI lesson progress for student
  console.log('📈 Creating AI lesson progress...');
  
  await prisma.lessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id: student.id,
        lesson_id: 1,
      },
    },
    update: {},
    create: {
      user_id: student.id,
      lesson_id: 1,
      completed: true,
      completed_at: new Date(),
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id: student.id,
        lesson_id: 2,
      },
    },
    update: {},
    create: {
      user_id: student.id,
      lesson_id: 2,
      completed: true,
      completed_at: new Date(),
    },
  });

  await prisma.lessonProgress.upsert({
    where: {
      user_id_lesson_id: {
        user_id: student.id,
        lesson_id: 3,
      },
    },
    update: {},
    create: {
      user_id: student.id,
      lesson_id: 3,
      completed: false, // Currently working on lesson 3
    },
  });

  // Create sample lesson attempt for student
  await prisma.lessonAttempt.upsert({
    where: {
      user_id_lesson_id: {
        user_id: student.id,
        lesson_id: 1,
      },
    },
    update: {},
    create: {
      user_id: student.id,
      lesson_id: 1,
      simple_prompt: 'List 5 healthy eating habits that reduce cholesterol.',
      simple_evaluation_score: 85,
      simple_evaluation_feedback: 'Good structure and clarity. Well done!',
      simple_is_complete: true,
      visited_stages: ['read', 'practice', 'evaluate'],
    },
  });

  console.log('✅ Created AI lesson progress and attempts');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Test Accounts (Linear AI Learning System):');
  console.log('   Experienced Student: john@trailix.com (has progress)');
  console.log('   New Student: jane@trailix.com (needs onboarding)');
  console.log('   Password: Test123!@#');
  console.log(`\n🧠 AI Lessons seeded: ${seedCount} lessons`);
  console.log('📊 Sample progress and attempts created for experienced user');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

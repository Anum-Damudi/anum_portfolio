import { PrismaClient, ExperimentStatus, GuestbookStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting portfolio database seed...');

  // 1. Seed Admin
  const adminEmail = process.env.ADMIN_EMAIL || 'damudianum@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '@n15$h24Ru40';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      passwordHash,
    },
  });
  console.log(`✅ Admin user seeded: ${admin.email}`);

  // 2. Clear existing public data to ensure clean idempotency
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.numiLine.deleteMany();
  await prisma.guestbookEntry.deleteMany();

  // 3. Seed Projects (Marked TODO for Anum to replace)
  await prisma.project.createMany({
    data: [
      {
        title: 'Algorithmic Trading Bot & Backtester',
        slug: 'algo-trading-bot',
        summary: 'High-throughput algorithmic trading bot with real-time websocket orderbook simulation and backtesting.',
        description: 'TODO: Anum - Add detailed architecture and performance metrics. Built with TypeScript, high-concurrency order execution simulation, and technical indicators analysis.',
        techStack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'WebSockets'],
        liveUrl: 'https://algo-demo.anum.dev',
        githubUrl: 'https://github.com/anum/algo-bot',
        imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800',
        featured: true,
        order: 1,
      },
      {
        title: 'Numi Quest: Pixel Mascot Engine',
        slug: 'numi-quest',
        summary: 'Interactive retro pixel-art mascot companion widget with state machines and dialogue trees.',
        description: 'TODO: Anum - Replace with your own project showcase. Canvas-based sprite renderer and interactive speech bubble state engine.',
        techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas API'],
        liveUrl: 'https://numi.anum.dev',
        githubUrl: 'https://github.com/anum/numi-quest',
        imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        featured: true,
        order: 2,
      },
      {
        title: 'Distributed Key-Value Store',
        slug: 'distributed-kv-store',
        summary: 'Lightweight Raft-consensus key-value store with sharding, snapshotting, and write-ahead logging.',
        description: 'TODO: Anum - Provide course final project details. Implemented log replication, leader election, and atomic failover in Go.',
        techStack: ['Go', 'gRPC', 'Protobuf', 'Raft'],
        liveUrl: null,
        githubUrl: 'https://github.com/anum/distributed-kv',
        imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        featured: false,
        order: 3,
      },
    ],
  });
  console.log('✅ Projects seeded (with TODO notices for Anum)');

  // 4. Seed Skills
  await prisma.skill.createMany({
    data: [
      // Languages
      { name: 'TypeScript', category: 'Languages', level: 'Advanced', order: 1 },
      { name: 'Python', category: 'Languages', level: 'Advanced', order: 2 },
      { name: 'C / C++', category: 'Languages', level: 'Intermediate', order: 3 },
      { name: 'Go', category: 'Languages', level: 'Intermediate', order: 4 },
      { name: 'SQL (PostgreSQL)', category: 'Languages', level: 'Advanced', order: 5 },

      // Backend & Systems
      { name: 'Node.js & Express', category: 'Backend & Systems', level: 'Advanced', order: 1 },
      { name: 'Prisma ORM', category: 'Backend & Systems', level: 'Advanced', order: 2 },
      { name: 'PostgreSQL', category: 'Backend & Systems', level: 'Advanced', order: 3 },
      { name: 'Docker & Containers', category: 'Backend & Systems', level: 'Intermediate', order: 4 },
      { name: 'Redis', category: 'Backend & Systems', level: 'Intermediate', order: 5 },

      // Frontend
      { name: 'React & Vite', category: 'Frontend', level: 'Advanced', order: 1 },
      { name: 'Tailwind CSS', category: 'Frontend', level: 'Advanced', order: 2 },
      { name: 'HTML5 Canvas & Pixel Art', category: 'Frontend', level: 'Intermediate', order: 3 },

      // DevOps & Tools
      { name: 'Git & GitHub', category: 'DevOps & Tools', level: 'Advanced', order: 1 },
      { name: 'Linux / Bash', category: 'DevOps & Tools', level: 'Advanced', order: 2 },
      { name: 'Vitest & Jest', category: 'DevOps & Tools', level: 'Advanced', order: 3 },
      { name: 'CI/CD (GitHub Actions)', category: 'DevOps & Tools', level: 'Intermediate', order: 4 },
    ],
  });
  console.log('✅ Skills seeded');

  // 5. Seed Achievements
  await prisma.achievement.createMany({
    data: [
      {
        title: "Dean's Honor List",
        description: 'Awarded for exceptional academic performance in Computer Science across consecutive semesters.',
        date: 'Fall 2024',
        icon: 'award',
      },
      {
        title: 'Hackathon 1st Place - Best Systems Hack',
        description: 'Architected and built a high-speed offline-first decentralized synchronization tool in 36 hours.',
        date: 'Spring 2024',
        icon: 'trophy',
      },
      {
        title: 'Open Source Contributor',
        description: 'Contributed performance improvements and bugfixes to popular developer tooling repositories.',
        date: '2023 - Present',
        icon: 'git-pull-request',
      },
    ],
  });
  console.log('✅ Achievements seeded');

  // 6. Seed Experiments
  await prisma.experiment.createMany({
    data: [
      {
        title: 'WebAssembly Neural Net Inference in Browser',
        description: 'Testing real-time digit recognition compiled from C++ to WebAssembly with zero server roundtrips.',
        status: ExperimentStatus.in_progress,
        link: 'https://github.com/anum/wasm-nn',
      },
      {
        title: 'Peer-to-Peer Encrypted Chunk Streaming',
        description: 'WebRTC data channels for low-latency browser-to-browser peer file transfer.',
        status: ExperimentStatus.idea,
        link: null,
      },
      {
        title: 'Custom Linux Netfilter Packet Inspector',
        description: 'Kernel module inspecting raw TCP window scaling headers and throttling flagged flows.',
        status: ExperimentStatus.shipped,
        link: 'https://github.com/anum/kernel-filter',
      },
      {
        title: 'Software Raytracer in Rust',
        description: 'Experimental BVH-accelerated raytracer from scratch (broken after refactor).',
        status: ExperimentStatus.broken,
        link: 'https://github.com/anum/old-raytracer',
      },
    ],
  });
  console.log('✅ Experiments seeded');

  // 7. Seed "Currently" Widget
  await prisma.currently.upsert({
    where: { id: 'current' },
    update: {
      learning: 'Distributed consensus algorithms & database storage engine internals',
      building: 'Portfolio backend API & Numi pixel mascot interactive dialogue state machine',
      listeningTo: 'Synthwave & Lo-Fi Coding Beats',
    },
    create: {
      id: 'current',
      learning: 'Distributed consensus algorithms & database storage engine internals',
      building: 'Portfolio backend API & Numi pixel mascot interactive dialogue state machine',
      listeningTo: 'Synthwave & Lo-Fi Coding Beats',
    },
  });
  console.log('✅ "Currently" widget status seeded');

  // 8. Seed Numi Lines
  await prisma.numiLine.createMany({
    data: [
      // Hero section
      { section: 'hero', line: "Hi there! I'm Numi, Anum's pixel companion. Watch your step, bugs might bite!" },
      { section: 'hero', line: "*sips 8-bit coffee* Welcome to Anum's corner of the internet! Explore away!" },
      { section: 'hero', line: "Beep boop! All systems operational, zero coffee spills reported today." },

      // About section
      { section: 'about', line: "Anum writes code. I supervise and make sure the syntax is aesthetic." },
      { section: 'about', line: "Computer Science by day, pixel art enthusiast by night!" },

      // Projects section
      { section: 'projects', line: "These projects were forged in the fires of late-night debugging sessions." },
      { section: 'projects', line: "Check out the live demos! Everything is tested... mostly." },
      { section: 'projects', line: "Click any project card to dive into the architecture and GitHub repo!" },

      // Skills section
      { section: 'skills', line: "100% certified in turning caffeine into clean TypeScript." },
      { section: 'skills', line: "Notice PostgreSQL up there? That's what powers this very speech bubble!" },
      { section: 'skills', line: "Stack Overflow status: pinned tab on browser #1." },

      // Contact section
      { section: 'contact', line: "Drop a note! Anum actually checks their inbox, I promise." },
      { section: 'contact', line: "Spam bots beware: our honeypot is hungry!" },

      // Guestbook section
      { section: 'guestbook', line: "Leave a friendly note in the guestbook! Be kind, I read every single one." },
      { section: 'guestbook', line: "Sign the guestbook and become part of portfolio history!" },
    ],
  });
  console.log('✅ Numi speech bubble lines seeded');

  // 9. Seed Guestbook entries
  await prisma.guestbookEntry.createMany({
    data: [
      {
        name: 'Ada Lovelace',
        message: 'Delightful pixel aesthetic and solid engineering principles! Keep up the brilliant work.',
        status: GuestbookStatus.approved,
        approvedAt: new Date(),
      },
      {
        name: 'Grace Hopper',
        message: 'Inspected the code: no moths in the relays today! Wonderful portfolio.',
        status: GuestbookStatus.approved,
        approvedAt: new Date(),
      },
    ],
  });
  console.log('✅ Sample approved guestbook entries seeded');

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

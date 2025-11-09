import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

describe('Plant CRUD Operations', () => {
  let testUser: any;
  let testUserId: string;
  let anotherUserId: string;

  beforeAll(async () => {
    // Create test users
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    testUser = await prisma.user.create({
      data: {
        email: 'planttest@example.com',
        password: hashedPassword,
        name: 'Plant Test User',
      },
    });
    testUserId = testUser.id;

    const anotherUser = await prisma.user.create({
      data: {
        email: 'another@example.com',
        password: hashedPassword,
        name: 'Another User',
      },
    });
    anotherUserId = anotherUser.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.plant.deleteMany({ where: { userId: { in: [testUserId, anotherUserId] } } });
    await prisma.user.deleteMany({ where: { id: { in: [testUserId, anotherUserId] } } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up plants before each test
    await prisma.plant.deleteMany({ where: { userId: testUserId } });
  });

  describe('Plant Creation', () => {
    it('should create a plant with valid data', async () => {
      const plantData = {
        name: 'Monstera Deliciosa',
        species: 'Monstera',
        location: 'Living Room',
        userId: testUserId,
      };

      const plant = await prisma.plant.create({ data: plantData });

      expect(plant).toBeDefined();
      expect(plant.name).toBe(plantData.name);
      expect(plant.species).toBe(plantData.species);
      expect(plant.location).toBe(plantData.location);
      expect(plant.userId).toBe(testUserId);
      expect(plant.isDeleted).toBe(false);
    });

    it('should create a plant with optional fields', async () => {
      const plantData = {
        name: 'Snake Plant',
        species: 'Sansevieria',
        imageUrl: 'https://example.com/snake-plant.jpg',
        location: 'Bedroom',
        acquisitionDate: new Date('2024-01-15'),
        notes: 'Low maintenance plant',
        userId: testUserId,
      };

      const plant = await prisma.plant.create({ data: plantData });

      expect(plant.imageUrl).toBe(plantData.imageUrl);
      expect(plant.acquisitionDate).toEqual(plantData.acquisitionDate);
      expect(plant.notes).toBe(plantData.notes);
    });

    it('should fail to create plant without required name', async () => {
      const plantData = {
        species: 'Unknown',
        userId: testUserId,
      };

      await expect(
        prisma.plant.create({ data: plantData as any })
      ).rejects.toThrow();
    });
  });

  describe('Plant Retrieval', () => {
    beforeEach(async () => {
      // Create test plants
      await prisma.plant.createMany({
        data: [
          { name: 'Monstera', species: 'Monstera Deliciosa', location: 'Living Room', userId: testUserId },
          { name: 'Snake Plant', species: 'Sansevieria', location: 'Bedroom', userId: testUserId },
          { name: 'Pothos', species: 'Epipremnum aureum', location: 'Kitchen', userId: testUserId },
          { name: 'Deleted Plant', species: 'Test', location: 'Nowhere', userId: testUserId, isDeleted: true },
        ],
      });
    });

    it('should retrieve all non-deleted plants for a user', async () => {
      const plants = await prisma.plant.findMany({
        where: { userId: testUserId, isDeleted: false },
      });

      expect(plants).toHaveLength(3);
      expect(plants.every(p => !p.isDeleted)).toBe(true);
    });

    it('should filter plants by location', async () => {
      const plants = await prisma.plant.findMany({
        where: { userId: testUserId, location: 'Bedroom', isDeleted: false },
      });

      expect(plants).toHaveLength(1);
      expect(plants[0].name).toBe('Snake Plant');
    });

    it('should search plants by name', async () => {
      const plants = await prisma.plant.findMany({
        where: {
          userId: testUserId,
          name: { contains: 'Plant', mode: 'insensitive' },
          isDeleted: false,
        },
      });

      expect(plants.length).toBeGreaterThanOrEqual(1);
    });

    it('should retrieve single plant by id', async () => {
      const created = await prisma.plant.create({
        data: { name: 'Test Plant', userId: testUserId },
      });

      const plant = await prisma.plant.findUnique({
        where: { id: created.id },
      });

      expect(plant).toBeDefined();
      expect(plant?.id).toBe(created.id);
    });
  });

  describe('Plant Update', () => {
    it('should update plant fields', async () => {
      const plant = await prisma.plant.create({
        data: { name: 'Original Name', userId: testUserId },
      });

      const updated = await prisma.plant.update({
        where: { id: plant.id },
        data: {
          name: 'Updated Name',
          species: 'New Species',
          location: 'New Location',
        },
      });

      expect(updated.name).toBe('Updated Name');
      expect(updated.species).toBe('New Species');
      expect(updated.location).toBe('New Location');
    });

    it('should update only specified fields', async () => {
      const plant = await prisma.plant.create({
        data: {
          name: 'Test Plant',
          species: 'Original Species',
          location: 'Original Location',
          userId: testUserId,
        },
      });

      const updated = await prisma.plant.update({
        where: { id: plant.id },
        data: { location: 'New Location' },
      });

      expect(updated.name).toBe('Test Plant');
      expect(updated.species).toBe('Original Species');
      expect(updated.location).toBe('New Location');
    });
  });

  describe('Plant Deletion', () => {
    it('should soft delete a plant', async () => {
      const plant = await prisma.plant.create({
        data: { name: 'To Delete', userId: testUserId },
      });

      const deleted = await prisma.plant.update({
        where: { id: plant.id },
        data: { isDeleted: true },
      });

      expect(deleted.isDeleted).toBe(true);

      // Verify it's not in active plants
      const activePlants = await prisma.plant.findMany({
        where: { userId: testUserId, isDeleted: false },
      });
      expect(activePlants.find(p => p.id === plant.id)).toBeUndefined();
    });
  });

  describe('Authorization', () => {
    it('should only retrieve plants belonging to the user', async () => {
      // Create plants for both users
      await prisma.plant.create({
        data: { name: 'User 1 Plant', userId: testUserId },
      });
      await prisma.plant.create({
        data: { name: 'User 2 Plant', userId: anotherUserId },
      });

      const user1Plants = await prisma.plant.findMany({
        where: { userId: testUserId, isDeleted: false },
      });

      expect(user1Plants).toHaveLength(1);
      expect(user1Plants[0].name).toBe('User 1 Plant');
    });

    it('should not allow updating another user\'s plant', async () => {
      const plant = await prisma.plant.create({
        data: { name: 'User 2 Plant', userId: anotherUserId },
      });

      // Attempt to update with wrong user check
      const userPlant = await prisma.plant.findFirst({
        where: { id: plant.id, userId: testUserId },
      });

      expect(userPlant).toBeNull();
    });
  });
});

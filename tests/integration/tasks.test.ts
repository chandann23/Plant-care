import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, TaskType } from '@/generated/prisma';
import bcrypt from 'bcryptjs';
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

describe('Task Completion Flow', () => {
  let testUserId: string;
  let testPlantId: string;
  let testScheduleId: string;

  beforeAll(async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'tasktest@example.com',
        password: hashedPassword,
        name: 'Task Test User',
      },
    });
    testUserId = user.id;

    // Create test plant
    const plant = await prisma.plant.create({
      data: {
        name: 'Test Plant',
        userId: testUserId,
      },
    });
    testPlantId = plant.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.careTask.deleteMany({ where: { plantId: testPlantId } });
    await prisma.careSchedule.deleteMany({ where: { plantId: testPlantId } });
    await prisma.plant.deleteMany({ where: { id: testPlantId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    // Clean up schedules and tasks before each test
    await prisma.careTask.deleteMany({ where: { plantId: testPlantId } });
    await prisma.careSchedule.deleteMany({ where: { plantId: testPlantId } });
  });

  describe('Task Completion', () => {
    it('should complete a task without notes or photo', async () => {
      // Create schedule
      const startDate = new Date();
      const schedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.WATERING,
          frequencyDays: 3,
          timeOfDay: '09:00',
          startDate,
          nextDueDate: startDate,
        },
      });

      // Complete task
      const task = await prisma.careTask.create({
        data: {
          scheduleId: schedule.id,
          plantId: testPlantId,
        },
      });

      expect(task).toBeDefined();
      expect(task.scheduleId).toBe(schedule.id);
      expect(task.plantId).toBe(testPlantId);
      expect(task.notes).toBeNull();
      expect(task.photoUrl).toBeNull();
    });

    it('should complete a task with notes and photo', async () => {
      const schedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.FERTILIZING,
          frequencyDays: 14,
          timeOfDay: '10:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      const taskData = {
        scheduleId: schedule.id,
        plantId: testPlantId,
        notes: 'Applied liquid fertilizer',
        photoUrl: 'https://example.com/photo.jpg',
      };

      const task = await prisma.careTask.create({ data: taskData });

      expect(task.notes).toBe(taskData.notes);
      expect(task.photoUrl).toBe(taskData.photoUrl);
    });

    it('should update schedule nextDueDate after task completion', async () => {
      const startDate = new Date();
      const frequencyDays = 7;
      
      const schedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.WATERING,
          frequencyDays,
          timeOfDay: '08:00',
          startDate,
          nextDueDate: startDate,
        },
      });

      // Complete task
      await prisma.careTask.create({
        data: {
          scheduleId: schedule.id,
          plantId: testPlantId,
        },
      });

      // Update schedule nextDueDate
      const expectedNextDueDate = addDays(startDate, frequencyDays);
      const updatedSchedule = await prisma.careSchedule.update({
        where: { id: schedule.id },
        data: { nextDueDate: expectedNextDueDate },
      });

      expect(updatedSchedule.nextDueDate.getTime()).toBeGreaterThan(startDate.getTime());
    });
  });

  describe('Task History', () => {
    it('should retrieve task history for a plant', async () => {
      const schedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.WATERING,
          frequencyDays: 3,
          timeOfDay: '09:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      // Create multiple completed tasks
      await prisma.careTask.createMany({
        data: [
          {
            scheduleId: schedule.id,
            plantId: testPlantId,
            completedAt: new Date('2024-01-01'),
            notes: 'First watering',
          },
          {
            scheduleId: schedule.id,
            plantId: testPlantId,
            completedAt: new Date('2024-01-04'),
            notes: 'Second watering',
          },
          {
            scheduleId: schedule.id,
            plantId: testPlantId,
            completedAt: new Date('2024-01-07'),
            notes: 'Third watering',
          },
        ],
      });

      const history = await prisma.careTask.findMany({
        where: { plantId: testPlantId },
        orderBy: { completedAt: 'desc' },
      });

      expect(history).toHaveLength(3);
      expect(history[0].notes).toBe('Third watering');
    });

    it('should retrieve task history with pagination', async () => {
      const schedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.WATERING,
          frequencyDays: 3,
          timeOfDay: '09:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      // Create 10 tasks
      const tasks = Array.from({ length: 10 }, (_, i) => ({
        scheduleId: schedule.id,
        plantId: testPlantId,
        completedAt: new Date(2024, 0, i + 1),
      }));

      await prisma.careTask.createMany({ data: tasks });

      // Get first page (5 items)
      const page1 = await prisma.careTask.findMany({
        where: { plantId: testPlantId },
        orderBy: { completedAt: 'desc' },
        take: 5,
        skip: 0,
      });

      expect(page1).toHaveLength(5);

      // Get second page
      const page2 = await prisma.careTask.findMany({
        where: { plantId: testPlantId },
        orderBy: { completedAt: 'desc' },
        take: 5,
        skip: 5,
      });

      expect(page2).toHaveLength(5);
      expect(page1[0].id).not.toBe(page2[0].id);
    });

    it('should retrieve task history with schedule and plant details', async () => {
      const schedule = await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.FERTILIZING,
          frequencyDays: 14,
          timeOfDay: '10:00',
          startDate: new Date(),
          nextDueDate: new Date(),
        },
      });

      await prisma.careTask.create({
        data: {
          scheduleId: schedule.id,
          plantId: testPlantId,
          notes: 'Fertilized with organic mix',
        },
      });

      const history = await prisma.careTask.findMany({
        where: { plantId: testPlantId },
        include: {
          schedule: true,
          plant: true,
        },
      });

      expect(history[0].schedule).toBeDefined();
      expect(history[0].schedule.taskType).toBe(TaskType.FERTILIZING);
      expect(history[0].plant).toBeDefined();
      expect(history[0].plant.name).toBe('Test Plant');
    });
  });

  describe('Upcoming Tasks', () => {
    it('should retrieve tasks due today', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.WATERING,
          frequencyDays: 3,
          timeOfDay: '09:00',
          startDate: today,
          nextDueDate: today,
          isActive: true,
        },
      });

      const tomorrow = addDays(today, 1);
      await prisma.careSchedule.create({
        data: {
          plantId: testPlantId,
          taskType: TaskType.FERTILIZING,
          frequencyDays: 7,
          timeOfDay: '10:00',
          startDate: tomorrow,
          nextDueDate: tomorrow,
          isActive: true,
        },
      });

      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);

      const dueToday = await prisma.careSchedule.findMany({
        where: {
          plantId: testPlantId,
          isActive: true,
          isDeleted: false,
          nextDueDate: {
            gte: today,
            lte: endOfDay,
          },
        },
        include: { plant: true },
      });

      expect(dueToday).toHaveLength(1);
      expect(dueToday[0].taskType).toBe(TaskType.WATERING);
    });

    it('should retrieve tasks due in date range', async () => {
      const today = new Date();
      const in3Days = addDays(today, 3);
      const in7Days = addDays(today, 7);

      await prisma.careSchedule.createMany({
        data: [
          {
            plantId: testPlantId,
            taskType: TaskType.WATERING,
            frequencyDays: 3,
            timeOfDay: '09:00',
            startDate: today,
            nextDueDate: in3Days,
            isActive: true,
          },
          {
            plantId: testPlantId,
            taskType: TaskType.FERTILIZING,
            frequencyDays: 7,
            timeOfDay: '10:00',
            startDate: today,
            nextDueDate: in7Days,
            isActive: true,
          },
        ],
      });

      const endDate = addDays(today, 7);
      const upcomingTasks = await prisma.careSchedule.findMany({
        where: {
          plantId: testPlantId,
          isActive: true,
          isDeleted: false,
          nextDueDate: {
            gte: today,
            lte: endDate,
          },
        },
        orderBy: { nextDueDate: 'asc' },
      });

      expect(upcomingTasks).toHaveLength(2);
      expect(upcomingTasks[0].taskType).toBe(TaskType.WATERING);
      expect(upcomingTasks[1].taskType).toBe(TaskType.FERTILIZING);
    });
  });
});

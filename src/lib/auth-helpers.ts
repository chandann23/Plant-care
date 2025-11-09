/**
 * Authentication and authorization helper functions
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * Verify user is authenticated and return session
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Verify user owns a plant
 */
export async function verifyPlantOwnership(plantId: string, userId: string) {
  const plant = await prisma.plant.findFirst({
    where: {
      id: plantId,
      userId,
      isDeleted: false,
    },
    select: { id: true },
  });

  if (!plant) {
    throw new Error("Plant not found or access denied");
  }

  return plant;
}

/**
 * Verify user owns a schedule (through plant ownership)
 */
export async function verifyScheduleOwnership(scheduleId: string, userId: string) {
  const schedule = await prisma.careSchedule.findFirst({
    where: {
      id: scheduleId,
      plant: {
        userId,
        isDeleted: false,
      },
      isDeleted: false,
    },
    select: { id: true, plantId: true },
  });

  if (!schedule) {
    throw new Error("Schedule not found or access denied");
  }

  return schedule;
}

/**
 * Verify user owns a task (through plant ownership)
 */
export async function verifyTaskOwnership(taskId: string, userId: string) {
  const task = await prisma.careTask.findFirst({
    where: {
      id: taskId,
      plant: {
        userId,
        isDeleted: false,
      },
    },
    select: { id: true },
  });

  if (!task) {
    throw new Error("Task not found or access denied");
  }

  return task;
}

/**
 * Create a standardized unauthorized response
 */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/**
 * Create a standardized forbidden response
 */
export function forbiddenResponse(message = "Access denied") {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * Create a standardized not found response
 */
export function notFoundResponse(message = "Resource not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

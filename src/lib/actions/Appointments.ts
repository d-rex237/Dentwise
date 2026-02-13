"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "../prisma";

function transformAppointments(appointment: any) {
  return {
    ...appointment,
    patientName:
      `${appointment.user.firstName || ""} ${appointment.user.lastName || ""}`.trim(),
    patientEmail: appointment.user.email,
    doctorName: appointment.doctor.name,
    doctorImageUrl: appointment.doctor.imageUrl,
    date: appointment.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
  };
}

export async function getAppointments() {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: {
          select: { name: true, imageUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Could not fetch appointments");
  }
}

export async function getUserAppointments() {
  try {
    const { userId } = await auth();

    if (!userId) throw new Error("You must be logged in to view appointments");

    //Find user by clerkId from authentication session
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user)
      throw new Error(
        "User not found. Please ensure your account is properly setup.",
      );

    const appointments = await prisma.appointment.findMany({
      where: { userId: user.id },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        doctor: { select: { name: true, imageUrl: true } },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });

    return appointments.map(transformAppointments);
  } catch (error) {
    console.error("Error fetching user appointments", error);
  }
}

export async function getUserAppointmentsStats() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You mus authenticate");
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("user not found");

    const [totalCount, completedCount] = await Promise.all([
      prisma.appointment.count({
        where: { userId: user.id },
      }),
      prisma.appointment.count({
        where: { userId: user.id, status: "COMPLETED" },
      }),
    ]);

    return {
      total: totalCount,
      completed: completedCount,
    };
  } catch (error) {
    console.log("Error Fetching user appointments status", error);

    return {
      totalAppointments: 0,
      completedAppointments: 0,
    };
  }
}

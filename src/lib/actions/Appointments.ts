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

export async function getBookedTimeSlots(doctorId: string, date: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date: new Date(date),
        status: {
          in: ["COMPLETED", "SCHEDULED"], // only consider confirmed and completed appointments as booked
        },
      },
      select: { time: true },
    });

    return appointments.map((appointment) => appointment.time);
  } catch (error) {
    console.error("Error fetching booked timeslots", error);
    return [];
  }
}

interface BookAppointmentInput {
  doctorId: string;
  date: string;
  time: string;
  reason?: string;
}

export async function bookAppointment(input: BookAppointmentInput) {
  try {
    const { userId } = await auth();
    if (!userId)
      throw new Error("You must authenticate to book an appointment");

    if (!input.doctorId || !input.date || !input.time) {
      throw new Error(
        "Doctor, date and time are required to book an appointment",
      );
    }

    const user = await prisma.user.findUnique({ where: { clerkId: userId } });

    if (!user) throw new Error("User not found");

    const appointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        doctorId: input.doctorId,
        date: new Date(input.date),
        time: input.time,
        reason: input.reason || "General consultation",
        status: "SCHEDULED",
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        doctor: { select: { name: true, imageUrl: true } },
      },
    });

    return transformAppointments(appointment);
  } catch (error) {
    console.error("Error booking appointment:", error);
    throw new Error("Could not book appointment");
  }
}

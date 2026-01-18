"use server";

import { gender } from "@prisma/client";
import { prisma } from "../prisma";
import { generateAvatar } from "../utils";
import { revalidatePath } from "next/cache";

export async function getDoctors() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return doctors.map((doctor) => ({
      ...doctor,
      appointmentCount: doctor._count.appointments,
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    throw new Error("Could not fetch doctors");
  }
}

// ✅ Correct
interface CreateDoctorInput {
  name: string;
  email: string;
  phone: string;
  specialty: string;
  imageUrl: string;
  gender: gender;
  Isactive: boolean; // ✅ Change this from isActive to Isactive
}

export async function createDoctor(input: CreateDoctorInput) {
  try {
    if (!input.name || !input.email)
      throw new Error("Name and Email are required");

    // 1. Destructure imageUrl OUT of input so we don't spread it into the DB
    const { imageUrl, ...rest } = input;

    const doctor = await prisma.doctor.create({
      data: {
        ...rest, // This contains name, email, phone, etc.
        imageUrl: generateAvatar(
          input.name,
          input.gender === "FEMALE" ? "FEMALE" : "MALE",
        ),
      },
    });

    revalidatePath("/admin");
    return doctor;
  } catch (error: any) {
    console.error("Error creating doctor:", error);
    // Important: Re-throw the error so the frontend mutation knows it failed
    if (error?.code === "P2002") {
      throw new Error("A doctor with this email already exists");
    }
    throw new Error(error.message || "Failed to create doctor");
  }
}

interface UpdateDoctorInput extends Partial<CreateDoctorInput> {
  id: string;
}

export async function updateDoctor(input: UpdateDoctorInput) {
  try {
    //validate
    if (!input.name || !input.email)
      throw new Error("name and email are required ");

    const currentDoctor = await prisma.doctor.findUnique({
      where: { id: input.id },
      select: { email: true },
    });

    if (!currentDoctor) throw new Error("Doctor Not Found");

    //if email is changing check if new email already exist
    if (input.email !== currentDoctor.email) {
      const existingDoctor = await prisma.doctor.findUnique({
        where: { email: input.email },
      });
      if (existingDoctor) {
        throw new Error("a doctor with this email already exists");
      }
    }

    const doctor = await prisma.doctor.update({
      where: { id: input.id },
      data: {
        name: input.name,
        email: input.email,
        phone: input.phone,
        specialty: input.specialty,
        gender: input.gender,
        Isactive: input.Isactive,
      },
    });

    return doctor;
  } catch (error) {
    console.error("Error updating doctor:", error);
    throw new Error("Could not update doctor");
  }
}

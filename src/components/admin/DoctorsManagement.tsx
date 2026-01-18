import { useGetDoctors } from "@/hooks/use-doctors";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { EditIcon, MailIcon, PlusIcon, StethoscopeIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Badge } from "../ui/badge";
import AddDoctorDialog from "./AddDoctorDialog";
import EditDoctorsDialog from "./EditDoctorsDialog";
import { Doctor } from "@prisma/client";

function DoctorsManagement() {
  const { data: doctors = [] } = useGetDoctors();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleEditDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsEditDialogOpen(true);
  };
  const handleCloseEditDoctor = () => {
    setSelectedDoctor(null);
    setIsEditDialogOpen(false);
  };
  return (
    <>
      <Card className="mb-8">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <StethoscopeIcon className="size-5 text-primary" />
              Doctors Management
            </CardTitle>
            <CardDescription>
              Manage and oversee all doctors in your practice
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/100"
          >
            <PlusIcon className="size-4 mr-2" /> Add Doctor
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctors.map((doctor: any) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="relative size-12 flex-shrink-0 bg-muted rounded-full overflow-hidden">
                    <Image
                      src={doctor.imageUrl}
                      alt={doctor.name}
                      fill
                      unoptimized // ✅ This forces the image to load without Next.js processing it
                      className="object-cover"
                      onError={(e) =>
                        console.log("Image failed to load for:", doctor.name)
                      }
                    />
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-white leading-none mb-1">
                      {doctor.name}
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {doctor.specialty}

                      <span className="ml-2 px-2 py-0.5 bg-muted rounded text-xs">
                        {doctor.gender === "MALE" ? "Male" : "Female"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MailIcon className="h-3 w-3" />
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-semibold text-primary">
                      {doctor.appointmentCount}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      appointments
                    </div>
                  </div>

                  {doctor.Isactive ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => handleEditDoctor(doctor)}
                  >
                    <EditIcon className="size-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <AddDoctorDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      <EditDoctorsDialog
        key={selectedDoctor?.id}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDoctor}
        doctor={selectedDoctor}
      />
    </>
  );
}

export default DoctorsManagement;

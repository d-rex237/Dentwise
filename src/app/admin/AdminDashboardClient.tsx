"use client";

import AdminStats from "@/components/admin/AdminStats";
import DoctorsManagement from "@/components/admin/DoctorsManagement";
import Navbar from "@/components/Navbar";
import { useGetAppointments } from "@/hooks/use-appointments";
import { useGetDoctors } from "@/hooks/use-doctors";
import { useUser } from "@clerk/nextjs";
import { SettingsIcon } from "lucide-react";

function AdminDashboardClient() {
  const { user } = useUser();
  const { data: doctors = [], isLoading: doctorsLoading } = useGetDoctors();
  const { data: appointments = [], isLoading: appointmentsLoading } =
    useGetAppointments();

  // calculating states from real data
  const stats = {
    totalDoctors: doctors.length,
    // Add (doc: any) to bypass the strict check, or use the exact property name
    activeDoctors: doctors.filter((doc: any) => doc.Isactive).length,
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(
      (app: any) => app.status === "COMPLETED",
    ).length,
  };
  if (doctorsLoading || appointmentsLoading) return <LoadingUI />;

  return (
    <div className="min-h-screen  bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* ADMIN WELCOME SECTION */}
        <div className="mb-12 flex items-center justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">
                Admin Dashboard
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || "Admin"}!
              </h1>
              <p className="text-muted-foreground">
                Manage doctors, oversee appointments, and monitor your dental
                practice performance.
              </p>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <SettingsIcon className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        <AdminStats
          totalDoctors={stats.totalDoctors}
          activeDoctors={stats.activeDoctors}
          totalAppointments={stats.totalAppointments}
          completedAppointments={stats.completedAppointments}
        />

        <DoctorsManagement />
      </div>
    </div>
  );
}

export default AdminDashboardClient;

function LoadingUI() {
  return (
    <div className="w-full p-6 space-y-8 bg-[#0a0a0a] min-h-screen">
      <Navbar />
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-32 bg-orange-500/20 animate-pulse rounded-full" />
        <div className="h-10 w-64 bg-zinc-800 animate-pulse rounded-lg" />
        <div className="h-4 w-96 bg-zinc-900 animate-pulse rounded-md" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-zinc-900/50 border border-zinc-800 animate-pulse rounded-2xl"
          />
        ))}
      </div>

      {/* List Container Skeleton */}
      <div className="border border-zinc-800 bg-zinc-900/30 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-40 bg-zinc-800 animate-pulse rounded" />
          <div className="h-10 w-32 bg-orange-500/20 animate-pulse rounded-xl" />
        </div>

        {/* Doctor Row Skeleton */}
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-black/20 border border-zinc-800/50 rounded-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-zinc-800 animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-40 bg-zinc-800 animate-pulse rounded" />
                <div className="h-4 w-32 bg-zinc-900 animate-pulse rounded" />
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-4 w-20 bg-zinc-900 animate-pulse rounded" />
              <div className="h-8 w-20 bg-emerald-500/10 animate-pulse rounded-full" />
              <div className="h-10 w-20 bg-zinc-800 animate-pulse rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

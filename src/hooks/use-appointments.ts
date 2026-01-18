"use client";
import { getAppointments } from "@/lib/actions/Appointments";
import { useQuery } from "@tanstack/react-query";

export function useGetAppointments() {
  const result = useQuery({
    queryKey: ["getAppointments"],
    queryFn: getAppointments,
  });
  return result;
}

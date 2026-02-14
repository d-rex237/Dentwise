"use client";

import {
  createDoctor,
  getAvailableDoctors,
  getDoctors,
  updateDoctor,
} from "@/lib/actions/doctors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDoctors() {
  const result = useQuery({
    queryKey: ["getDoctors"],
    queryFn: getDoctors,
  });
  return result;
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      // invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
    },
    onError: (error) => console.log("Error creating doctor"),
  });

  return result;
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();
  const result = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      // invalidate related queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["getDoctors"] });
      queryClient.invalidateQueries({ queryKey: ["getAvailableDoctors"] });
    },
    onError: (error) => console.log("Error updating doctor"),
  });

  return result;
}

// get available doctors appointments
export function useAvailableDoctors() {
  const result = useQuery({
    queryKey: ["getAvailableDoctors"],
    queryFn: getAvailableDoctors,
  });
  return result;
}

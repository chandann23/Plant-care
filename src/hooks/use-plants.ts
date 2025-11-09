import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreatePlantInput, UpdatePlantInput } from "@/lib/validations/plant";

interface Plant {
  id: string;
  name: string;
  species?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  acquisitionDate?: Date | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  careSchedules?: Array<{
    id: string;
    taskType: string;
    frequencyDays: number;
    timeOfDay: string;
  }>;
}

interface PlantsResponse {
  plants: Plant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PlantsFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string;
  species?: string;
}

export function usePlants(filters: PlantsFilters = {}) {
  return useQuery<PlantsResponse>({
    queryKey: ["plants", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());
      if (filters.search) params.append("search", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.species) params.append("species", filters.species);

      const response = await fetch(`/api/plants?${params}`);
      if (!response.ok) throw new Error("Failed to fetch plants");
      return response.json();
    },
  });
}

export function usePlant(id: string) {
  return useQuery<Plant>({
    queryKey: ["plants", id],
    queryFn: async () => {
      const response = await fetch(`/api/plants/${id}`);
      if (!response.ok) throw new Error("Failed to fetch plant");
      return response.json();
    },
    enabled: !!id,
  });
}

export function useCreatePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePlantInput) => {
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create plant");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

export function useUpdatePlant(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePlantInput) => {
      const response = await fetch(`/api/plants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update plant");
      }
      return response.json();
    },
    // Optimistic update
    onMutate: async (newData) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["plants", id] });

      // Snapshot previous value
      const previousPlant = queryClient.getQueryData<Plant>(["plants", id]);

      // Optimistically update
      if (previousPlant) {
        queryClient.setQueryData<Plant>(["plants", id], {
          ...previousPlant,
          ...newData,
          acquisitionDate: newData.acquisitionDate ? new Date(newData.acquisitionDate) : previousPlant.acquisitionDate,
          updatedAt: new Date(),
        });
      }

      return { previousPlant };
    },
    onError: (_err, _newData, context) => {
      // Rollback on error
      if (context?.previousPlant) {
        queryClient.setQueryData(["plants", id], context.previousPlant);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
      queryClient.invalidateQueries({ queryKey: ["plants", id] });
    },
  });
}

export function useDeletePlant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/plants/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete plant");
      }
      return response.json();
    },
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["plants"] });

      const previousPlants = queryClient.getQueryData<PlantsResponse>(["plants", {}]);

      // Optimistically remove from list
      if (previousPlants) {
        queryClient.setQueryData<PlantsResponse>(["plants", {}], {
          ...previousPlants,
          plants: previousPlants.plants.filter(p => p.id !== id),
        });
      }

      return { previousPlants };
    },
    onError: (_err, _id, context) => {
      // Rollback on error
      if (context?.previousPlants) {
        queryClient.setQueryData(["plants", {}], context.previousPlants);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plants"] });
    },
  });
}

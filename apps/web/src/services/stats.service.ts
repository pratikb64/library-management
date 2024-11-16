import { BACKEND_URL } from "@/env";
import { ApiResponse, Stats } from "@/types";

export const getStatsService = async () => {
  const response = await fetch(`${BACKEND_URL}/api/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Stats>;
};

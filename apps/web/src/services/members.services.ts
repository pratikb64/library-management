import { BACKEND_URL } from "@/env";
import { ApiPaginatedResponse, ApiResponse, Member } from "@/types";

export interface GetMembersArgs {
  first_name?: string;
  last_name?: string;
  email?: string;
  limit?: number;
  page?: number;
}

export const getMembersService = async (args?: GetMembersArgs) => {
  const url = new URL(`${BACKEND_URL}/api/members`);

  if (args?.first_name) url.searchParams.set("first_name", args.first_name);
  if (args?.last_name) url.searchParams.set("last_name", args.last_name);
  if (args?.email) url.searchParams.set("email", args.email);
  if (args?.page) url.searchParams.set("page", String(args.page));
  url.searchParams.set("limit", String(args?.limit || 100));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiPaginatedResponse<Member[]>;
};

export const createMemberService = async (
  member: Omit<Member, "id" | "joining_date">,
) => {
  const response = await fetch(`${BACKEND_URL}/api/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Member>;
};

export const deleteMemberService = async (id: number) => {
  const response = await fetch(`${BACKEND_URL}/api/members/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Member>;
};

interface UpdateMemberArgs {
  id: number;
  member: Partial<Member>;
}

export const updateMemberService = async (args: UpdateMemberArgs) => {
  const response = await fetch(`${BACKEND_URL}/api/members/${args.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args.member),
  });

  if (!response.ok) {
    return Promise.reject();
  }

  const data = await response.json();

  return data as ApiResponse<Member>;
};

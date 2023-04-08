import useSWR from "swr";
import { fetcher } from "@formbricks/lib/fetcher";

export const useMembers = (environmentId: string) => {
  const { data, isLoading, error, mutate, isValidating } = useSWR(
    `/api/v1/environments/${environmentId}/members/`,
    fetcher
  );

  return {
    team: data,
    isLoadingTeam: isLoading,
    isErrorTeam: error,
    isValidatingTeam: isValidating,
    mutateTeam: mutate,
  };
};

export const removeMember = async (teamId: string, userId: string) => {
  try {
    const result = await fetch(`/api/v1/teams/${teamId}/members/${userId}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return result.status === 200;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const deleteInvite = async (teamId: string, inviteId: string) => {
  try {
    const result = await fetch(`/api/v1/teams/${teamId}/invite/${inviteId}/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return result.status === 200;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const addMember = async (teamId: string, data: { name: string; email: string }) => {
  try {
    const result = await fetch(`/api/v1/teams/${teamId}/invite/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return result.status === 200;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const resendInvite = async (teamId: string, inviteId: string) => {
  try {
    const result = await fetch(`/api/v1/teams/${teamId}/invite/${inviteId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });
    return result.status === 200;
  } catch (error) {
    console.error(error);
    return false;
  }
};

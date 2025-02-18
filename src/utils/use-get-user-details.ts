import { UserDetails } from "@/types/member-profile/user";
import { useQuery } from "@tanstack/react-query";

const fetchUserDetails = async () => {
  const response = await fetch("http://localhost:3000/v1/user/get-data", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    mode: "cors",
  });

  if (!response.ok) {
    if(response.status === 500) localStorage.removeItem("accessToken");
    throw new Error(`Error: ${response.statusText}`);
  }

  const data: UserDetails = await response.json();
  return data;
};

export const useGetUserDetails = () => {
  return useQuery({
    queryKey: ["getUserDetails"],
    queryFn: fetchUserDetails,
  });
};

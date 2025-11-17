import { useQuery } from '@tanstack/react-query';
import { getAuthUser } from '../lib/axios';

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      console.log("Fetching auth user...");
      try {
        const data = await getAuthUser();
        console.log("Auth user data:", data);
        return data;
      } catch (error) {
        console.error("Auth user error:", error.response?.data || error.message);
        throw error;
      }
    },
    retry: false,
  });

  return { 
    isLoading: authUser.isLoading, 
    authUser: authUser.data?.user,
    error: authUser.error 
  };
};

export default useAuthUser;
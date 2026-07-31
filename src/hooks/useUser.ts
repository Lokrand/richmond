import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '../lib/auth';
import { userApi } from '../config';

const USER_QUERY_KEY = ['user'] as const;

export const useUser = () => useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: async () => {
        const authHeader = auth.getAuthorizationHeader();
        if (!authHeader) {
            return null;
        }
        const response = await userApi.apiV1UserGet({
            authorization: authHeader.Authorization,
        });
        return response;
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
});

export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ login, password }: { login: string; password: string }) => {
            const response = await userApi.apiV1UserLoginPost({
                request: {
                    login,
                    password,
                },
            });
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            auth.logout();
        },
        onSuccess: () => {
            auth.logout();
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        },
    });
};

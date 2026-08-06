import { useQuery } from '@tanstack/react-query';
import { catApi, postApi } from '../config';
import {
    InternalApiPostListPostsResponse,
    InternalApiPostPostResponse,
} from '../client/models';

export const catQueryKeys = {
    all: ['cats'] as const,
    detail: (id: number) => ['cat', id] as const,
};

export const postQueryKeys = {
    all: ['posts'] as const,
};

export const useCats = () => useQuery({
    queryKey: catQueryKeys.all,
    queryFn: () => catApi.apiV1CatAllGet(),
});

export const useCat = (id: number) => useQuery({
    queryKey: catQueryKeys.detail(id),
    queryFn: () => catApi.apiV1CatIdGet({ id }, { cache: 'no-store' }),
    enabled: Number.isInteger(id),
});

export const useCatPosts = (catId: number) => useQuery<
    InternalApiPostListPostsResponse,
    Error,
    InternalApiPostPostResponse[]
>({
    queryKey: postQueryKeys.all,
    queryFn: () => postApi.apiV1PostAllGet({ limit: 100 }),
    select: (response) => (response.posts ?? []).filter((post) => post.catId === String(catId)),
    enabled: Number.isInteger(catId),
});

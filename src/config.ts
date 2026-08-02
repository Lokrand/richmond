import {
    CatApi,
    Configuration,
    FileApi,
    HealthApi,
    PostApi,
    UserApi,
} from './client';

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8099';
export const BASE_S3_URL = process.env.NEXT_PUBLIC_BASE_S3_URL ?? 'http://localhost:9900';

export const apiConfig = new Configuration({ basePath: API_URL });

export const catApi = new CatApi(apiConfig);
export const fileApi = new FileApi(apiConfig);
export const healthApi = new HealthApi(apiConfig);
export const postApi = new PostApi(apiConfig);
export const userApi = new UserApi(apiConfig);

const updateCatPhotos = async (
    id: number,
    authorization: string,
    endpoint: 'images' | 'title-photo',
    files: Blob[],
) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));

    const response = await fetch(`${API_URL}/api/v1/cat/${id}/${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: authorization },
        body: formData,
    });
    if (!response.ok) throw new Error(`Photo update failed: ${response.status}`);
};

export const updateCatImages = (id: number, authorization: string, files: Blob[]) => (
    updateCatPhotos(id, authorization, 'images', files)
);
export const updateCatTitlePhoto = (id: number, authorization: string, file: Blob) => (
    updateCatPhotos(id, authorization, 'title-photo', [file])
);

export function getS3Path(filename: string) {
    return filename.replace('http://rustfs:9000', BASE_S3_URL);
}

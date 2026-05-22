import {
  CatApi,
  Configuration,
  FileApi,
  HealthApi,
  PostApi,
  UserApi,
} from "./client";

export const API_URL =
process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
export const BASE_S3_URL =
  process.env.NEXT_PUBLIC_BASE_S3_URL ?? "http://localhost:9900";

export const apiConfig = new Configuration({ basePath: API_URL });

export const catApi = new CatApi(apiConfig);
export const fileApi = new FileApi(apiConfig);
export const healthApi = new HealthApi(apiConfig);
export const postApi = new PostApi(apiConfig);
export const userApi = new UserApi(apiConfig);
export function getS3Path(filename: string) {
  return filename.replace("http://rustfs:9000", BASE_S3_URL);
}

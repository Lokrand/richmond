export interface TyCat {
  id: number;
  name: string;
  age: number;
  weight: number;
  breed: string;
  habits: string[];
  description: string;
  logo_path: string;
  logo_original_path?: string;
  gallery: string[];
  gallery_original?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CatFormData {
  name: string;
  age: string;
  weight: string;
  breed: string;
  habits: string;
  description: string;
  titlePhoto: File | null;
  galleryPhotos: File[];
}

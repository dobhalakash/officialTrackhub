export type MattressCategory =
  | 'MEMORY_FOAM'
  | 'SPRING'
  | 'LATEX'
  | 'HYBRID'
  | 'ORTHOPEDIC'
  | 'ORGANIC'
  | 'KIDS'
  | 'OTHER';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  categoryType: MattressCategory;
  active: boolean;
}

export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  categoryType?: MattressCategory;
  active?: boolean;
}

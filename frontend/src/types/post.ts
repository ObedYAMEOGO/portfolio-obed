export interface Post {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: string;
  feature_image_url?: string;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface PostCreate {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: string;
  feature_image_url?: string;
  is_published: boolean;
}


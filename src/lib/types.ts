export type CategoryName = "Plants" | "Pots" | "Fertilizers" | "Seeds" | "Accessories";

export interface Category {
  slug: string;
  name: CategoryName;
  title: string;
  description: string;
  image: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  scientificName?: string;
  category: CategoryName;
  description: string;
  currentPrice: number;
  originalPrice: number;
  bestSeller: boolean;
  stock: number;
  dateAdded: string;
  updatedAt: string;
  images: string[];
  tags: string[];
  reviews: Review[];
  // Plant-specific attributes; filters only show groups that apply to the current category.
  family?: string;
  size?: string;
  difficulty?: string;
  light?: string;
}

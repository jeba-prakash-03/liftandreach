export interface Category {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
  applications: string[] | null;
  industries: string[] | null;
  applicationAreas: string[] | null;
  sortOrder: number;
  isActive: boolean;
  parent?: { id: number; name: string; slug: string };
  children?: Category[];
  products?: Product[];
}

export interface SpecTableRow {
  label: string;
  values: string[];
}

export interface SpecTable {
  title?: string;
  columns: string[];
  rows: SpecTableRow[];
}

export interface Product {
  id: number;
  categoryId: number;
  code: string | null;
  name: string;
  slug: string;
  shortDesc: string | null;
  description: string | null;
  applications: string[] | null;
  industries: string[] | null;
  applicationAreas: string[] | null;
  specTables: SpecTable[] | null;
  notes: string[] | null;
  images: string[] | null;
  isActive: boolean;
  sortOrder: number;
  category?: {
    id: number;
    name: string;
    slug: string;
    parent?: { id: number; name: string; slug: string } | null;
  };
  relatedProducts?: Product[];
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string | null;
  badge: string | null;
  image: string;
  ctaText: string;
  ctaLink: string;
  ctaText2: string;
  ctaLink2: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  productId: number | null;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
  product?: {
    id: number;
    name: string;
    code: string | null;
    slug: string;
  } | null;
}

export type SettingsMap = Record<string, string>;

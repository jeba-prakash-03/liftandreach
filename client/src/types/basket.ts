export interface EnquiryBasketItem {
  id: number;
  name: string;
  code: string | null;
  slug: string;
  image: string | null;
  categoryName?: string;
  note?: string;
}

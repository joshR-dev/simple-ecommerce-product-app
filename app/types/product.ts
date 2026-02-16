export interface SizeOption {
  id: number;
  label: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  imageURL: string;
  sizeOptions: SizeOption[];
}

export interface CartItem {
  productId: number;
  productTitle: string;
  sizeLabel: string;
  price: number;
  quantity: number;
  imageURL: string;
}

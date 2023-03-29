export interface Product {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface PaymentRequestDto {
  products: Product[];
  currency: string;
}

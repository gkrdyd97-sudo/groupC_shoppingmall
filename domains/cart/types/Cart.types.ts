export interface Cart {
    id: number;
    userId?: string;
    imageUrl?: string;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
}
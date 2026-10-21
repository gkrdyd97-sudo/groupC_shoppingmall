export interface Cart {
    id: number;
    productId: string;
    productName: string;
    brand?: string;
    imageUrl?: string;
    optionId?: string;
    optionName?: string;
    quantity: number;
    price: number;
    optionPrice?: number;
    check?: boolean;
}

export interface CartInput {
    productId: string;
    optionId?: string;
    quantity: number;
}

export interface Cart {
    id: number;
    userId?: string;
    imageUrl?: string;
    productId: string;
    productName: string;
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

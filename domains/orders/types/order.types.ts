export interface OrderItemInput {
    productId: string;
    optionId?: string;
    quantity: number;
}

export interface CreateOrderInput {
    orderName: string;
    orderEmail: string;
    orderPhone: string;
    receiverName: string;
    receiverPhone: string;
    receiverZipcode: string;
    receiverAddress: string;
    receiverAddressSub: string;
    items: OrderItemInput[];
}

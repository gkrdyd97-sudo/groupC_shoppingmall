export interface Product {
    id: string;
    gid: string;
    styleCode: string;
    name: string;
    brand: string;
    shortDescription: string;
    longDescription: string;
    salePrice: number;
    consumerPrice: number;
    categoryId: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    imageUrl: string | null;
}

export interface ProductOption {
    id: string;
    name: string;
}

export interface ProductDetail extends Product {
    images: string[];
    options: ProductOption[];
}

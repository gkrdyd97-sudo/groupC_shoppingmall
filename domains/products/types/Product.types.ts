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
}
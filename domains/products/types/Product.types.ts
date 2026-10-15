export interface Product {
    id: number;
    category: 'tops' | 'bottoms' | 'shoes' | 'accessories';
    brand: string;
    name: string;
    price: number;
    images: string[];
    description: string;
    styleCode: string;
    country: string;
    sizes: string[];
}

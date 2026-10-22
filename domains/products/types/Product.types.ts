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

// ── 관리자 상품 관리용 ──

// 관리자 상품 목록 한 줄
export interface AdminProductRow {
    id: string;
    styleCode: string;
    name: string;
    brand: string;
    salePrice: number;
    consumerPrice: number;
    categoryName: string | null;
    optionCount: number;
    createdAt: string;
}

// 상품 옵션(사이즈 등) 입력값 - id 가 '' 이면 새로 추가하는 옵션
export interface ProductOptionInput {
    id: string;
    name: string;
    addPrice: string;
}

// 상품 등록/수정 폼 입력값 (숫자 칸도 폼에서는 문자열로 들어옴)
export interface ProductFormInput {
    name: string;
    brand: string;
    styleCode: string;
    categoryId: string;
    salePrice: string;
    consumerPrice: string;
    shortDescription: string;
    longDescription: string;
    options: ProductOptionInput[];
}

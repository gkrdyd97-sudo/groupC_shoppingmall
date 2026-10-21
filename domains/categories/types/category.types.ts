export interface Category {
    id?: string;
    parentId?: string | null;
    name: string;
    depth?: number;
    sortOrder?: number;
    children?: Category[];
}

export interface CategoryInput {
    name: string;
    parentId?: string;
}

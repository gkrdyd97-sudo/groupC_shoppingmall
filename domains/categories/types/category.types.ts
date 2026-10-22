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

// ── 관리자 카테고리/진열 관리용 (PRODUCT_CATEGORY 테이블 한 행) ──
export interface CategoryRow {
    id: string;
    name: string;
    parentId: string | null;
    sortOrder: number; // 진열 순서 (작을수록 앞)
    active: boolean; // 진열(노출) 여부
}

// 트리를 화면용 한 줄 목록으로 펼친 항목 (depth: 0 = 최상위)
export interface CategoryTreeItem extends CategoryRow {
    depth: number;
}

// 카테고리 등록/수정 폼 입력값
export interface CategoryFormInput {
    name: string;
    parentId: string; // '' 이면 최상위
    sortOrder: string;
    active: boolean;
}

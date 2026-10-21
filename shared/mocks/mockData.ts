import { BoardSetting } from '@/domains/boards/types/board.types';
import { Category } from '@/domains/categories/types/category.types';
import { FileInfo } from '@/domains/files/types/file.types';

// 중첩 카테고리 트리 Mock Data (러닝 전문 쇼핑몰 카테고리, 항목명은 임시)
export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-best',
        parent_id: null,
        name: 'BEST',
        depth: 1,
        sort_order: 1,
    },
    {
        id: 'cat-shoes',
        parent_id: null,
        name: 'SHOES',
        depth: 1,
        sort_order: 2,
        children: [
            {
                id: 'cat-shoes-1',
                parent_id: 'cat-shoes',
                name: '호무라 OG +',
                depth: 2,
                sort_order: 1,
                productId: 4001,
            },
            {
                id: 'cat-shoes-2',
                parent_id: 'cat-shoes',
                name: '퓨처 9 프로 FG/AG',
                depth: 2,
                sort_order: 2,
                productId: 4002,
            },
        ],
    },
    {
        id: 'cat-wear',
        parent_id: null,
        name: 'WEAR',
        depth: 1,
        sort_order: 3,
        children: [
            {
                id: 'cat-wear-top',
                parent_id: 'cat-wear',
                name: '상의',
                depth: 2,
                sort_order: 1,
                children: [
                    {
                        id: 'cat-wear-top-1',
                        parent_id: 'cat-wear-top',
                        name: '라이트 러닝 윈드 재킷',
                        depth: 3,
                        sort_order: 1,
                        productId: 1001,
                    },
                    {
                        id: 'cat-wear-top-2',
                        parent_id: 'cat-wear-top',
                        name: '에어핏 하프집업 롱슬리브',
                        depth: 3,
                        sort_order: 2,
                        productId: 1002,
                    },
                ],
            },
            {
                id: 'cat-wear-bottom',
                parent_id: 'cat-wear',
                name: '하의',
                depth: 2,
                sort_order: 2,
                children: [
                    {
                        id: 'cat-wear-bottom-1',
                        parent_id: 'cat-wear-bottom',
                        name: '러닝 포켓 쇼츠',
                        depth: 3,
                        sort_order: 1,
                        productId: 2001,
                    },
                    {
                        id: 'cat-wear-bottom-2',
                        parent_id: 'cat-wear-bottom',
                        name: '우먼 클래식 레깅스',
                        depth: 3,
                        sort_order: 2,
                        productId: 2002,
                    },
                ],
            },
        ],
    },
    {
        id: 'cat-goods',
        parent_id: null,
        name: 'ACC',
        depth: 1,
        sort_order: 4,
        children: [
            {
                id: 'cat-goods-1',
                parent_id: 'cat-goods',
                name: '퍼포먼스 러닝 선글라스',
                depth: 2,
                sort_order: 1,
                productId: 3001, 
            },
            {
                id: 'cat-goods-2',
                parent_id: 'cat-goods',
                name: '에어 메쉬 러닝 캡',
                depth: 2,
                sort_order: 2,
                productId: 3002,
            },
        ],
    },
];

// 게시판 설정 Mock Data
export const MOCK_BOARDS: BoardSetting[] = [
    {
        id: 'notice',
        name: '공지사항',
        description: '쇼핑몰 공지 및 이벤트 안내',
        write_role: 'admin',
        created_at: '2026-10-13T00:00:00Z',
    },
    {
        id: 'qna',
        name: '상품 Q&A',
        description: '상품 및 배송 관련 질문 게시판',
        write_role: 'user',
        created_at: '2026-10-13T00:00:00Z',
    },
    {
        id: 'review',
        name: '구매 후기',
        description: '실제 구매 고객 리뷰 게시판',
        write_role: 'user',
        created_at: '2026-10-13T00:00:00Z',
    },
];

// 범용 파일 메타데이터 Mock Data
export const MOCK_FILES: FileInfo[] = [
    {
        id: 1,
        gid: 'product-mock-1',
        location: 'product_main',
        original_name: 'sample_product.jpg',
        content_type: 'image/jpeg',
        extension: 'jpg',
        file_size: 102400,
        done: true,
        seq: 0,
        created_at: '2026-10-13T00:00:00Z',
        url: '/files/1',
    },
];

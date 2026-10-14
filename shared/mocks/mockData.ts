import { BoardSetting } from '@/domains/boards/types/board.types';
import { Category } from '@/domains/categories/types/category.types';
import { FileInfo } from '@/domains/files/types/file.types';

// 중첩 카테고리 트리 Mock Data
export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-fashion',
        parent_id: null,
        name: '패션의류',
        depth: 1,
        sort_order: 1,
        children: [
            {
                id: 'cat-fashion-top',
                parent_id: 'cat-fashion',
                name: '상의',
                depth: 2,
                sort_order: 1,
                children: [
                    {
                        id: 'cat-fashion-top-tshirt',
                        parent_id: 'cat-fashion-top',
                        name: '티셔츠',
                        depth: 3,
                        sort_order: 1,
                    },
                    {
                        id: 'cat-fashion-top-shirt',
                        parent_id: 'cat-fashion-top',
                        name: '셔츠/블라우스',
                        depth: 3,
                        sort_order: 2,
                    },
                ],
            },
            {
                id: 'cat-fashion-bottom',
                parent_id: 'cat-fashion',
                name: '하의',
                depth: 2,
                sort_order: 2,
                children: [
                    {
                        id: 'cat-fashion-bottom-denim',
                        parent_id: 'cat-fashion-bottom',
                        name: '데님팬츠',
                        depth: 3,
                        sort_order: 1,
                    },
                    {
                        id: 'cat-fashion-bottom-slacks',
                        parent_id: 'cat-fashion-bottom',
                        name: '슬랙스',
                        depth: 3,
                        sort_order: 2,
                    },
                ],
            },
        ],
    },
    {
        id: 'cat-digital',
        parent_id: null,
        name: '디지털/가전',
        depth: 1,
        sort_order: 2,
        children: [
            {
                id: 'cat-digital-pc',
                parent_id: 'cat-digital',
                name: '노트북/PC',
                depth: 2,
                sort_order: 1,
            },
            {
                id: 'cat-digital-acc',
                parent_id: 'cat-digital',
                name: '모바일 주변기기',
                depth: 2,
                sort_order: 2,
            },
        ],
    },
    {
        id: 'cat-living',
        parent_id: null,
        name: '홈/리빙',
        depth: 1,
        sort_order: 3,
        children: [
            {
                id: 'cat-living-furniture',
                parent_id: 'cat-living',
                name: '가구/인테리어',
                depth: 2,
                sort_order: 1,
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

import { type Cart } from '@/domains/cart/types/Cart.types';
export const MOCK_CART_ITEMS: Cart[] = [
    {
        id: 1,
        userId: 'user_01',
        imageUrl:
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
        productId: 101,
        productName: '무선 노이즈 캔슬링 헤드폰',
        quantity: 1,
        price: 10000,
    },
    {
        id: 2,
        userId: 'user_01',
        imageUrl:
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
        productId: 102,
        productName: '클래식 미니멀 손목시계',
        quantity: 2,
        price: 10000,
    },
    {
        id: 3,
        userId: 'user_01',
        imageUrl:
            'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60',
        productId: 103,
        productName: '피트니스 트래커 스마트워치',
        quantity: 1,
        price: 10000,
    },
    {
        id: 4,
        userId: 'user_02',
        imageUrl:
            'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500&auto=format&fit=crop&q=60',
        productId: 104,
        productName: '시트러스 아로마 룸 스프레이',
        quantity: 3,
        price: 10000,
    },
    {
        id: 5,
        userId: 'user_02',
        imageUrl:
            'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&auto=format&fit=crop&q=60',
        productId: 105,
        productName: '프리미엄 레더 스니커즈',
        quantity: 1,
        price: 10000,
    },
    {
        id: 6,
        userId: 'user_03',
        imageUrl:
            'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60',
        productId: 106,
        productName: '폴라로이드 즉석 카메라',
        quantity: 1,
        price: 10000,
    },
    {
        id: 7,
        userId: 'user_03',
        imageUrl:
            'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60',
        productId: 107,
        productName: '클래식 메탈 프레임 선글라스',
        quantity: 2,
        price: 10000,
    },
    {
        id: 8,
        userId: 'user_04',
        imageUrl:
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&auto=format&fit=crop&q=60',
        productId: 108,
        productName: '스튜디오 모니터링 유선 헤드폰',
        quantity: 1,
        price: 10000,
    },
    {
        id: 9,
        userId: 'user_04',
        imageUrl:
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&auto=format&fit=crop&q=60',
        productId: 109,
        productName: '인체공학 러닝화 (블랙)',
        quantity: 1,
        price: 10000,
    },
    {
        id: 10,
        userId: 'user_05',
        imageUrl:
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
        productId: 110,
        productName: '경량 로우탑 레이싱화 (레드)',
        quantity: 2,
        price: 10000,
    },
];

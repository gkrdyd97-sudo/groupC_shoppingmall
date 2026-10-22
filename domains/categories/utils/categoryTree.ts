// 카테고리 트리 계산 (순수 함수 → node:test 로 테스트)
import type { CategoryRow, CategoryTreeItem } from '../types/category.types';

// 진열 순서 → 이름 순으로 정렬
function compareCategory(a: CategoryRow, b: CategoryRow): number {
    return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
}

// DB 의 평평한 목록(parent_id 로 연결)을 "부모 → 자식" 순서의 한 줄 목록으로 펼친다
// 예) tops(0) → 반팔(1) → 긴팔(1) → bottoms(0) ...
// 화면에서 depth 만큼 들여쓰기해서 트리처럼 보여줌
export function flattenCategoryTree(rows: CategoryRow[]): CategoryTreeItem[] {
    const ids = new Set(rows.map((row) => row.id));
    const childrenOf = new Map<string | null, CategoryRow[]>();

    for (const row of rows) {
        // 부모가 삭제되어 없는 카테고리는 최상위로 취급 (목록에서 사라지지 않도록)
        const parentKey =
            row.parentId && ids.has(row.parentId) ? row.parentId : null;
        childrenOf.set(parentKey, [...(childrenOf.get(parentKey) ?? []), row]);
    }

    const result: CategoryTreeItem[] = [];
    const visited = new Set<string>(); // 잘못된 데이터로 순환(A→B→A)이 있어도 무한 반복 방지

    const visit = (parentKey: string | null, depth: number) => {
        for (const row of (childrenOf.get(parentKey) ?? []).sort(
            compareCategory,
        )) {
            if (visited.has(row.id)) continue;
            visited.add(row.id);
            result.push({ ...row, depth });
            visit(row.id, depth + 1);
        }
    };
    visit(null, 0);

    return result;
}

// 특정 카테고리의 모든 하위 카테고리 id (자기 자신 제외)
// 수정 시 "자기 자신이나 자기 하위"를 상위 분류로 고르면 순환이 생기므로 막는 데 사용
export function getDescendantIds(
    rows: CategoryRow[],
    targetId: string,
): string[] {
    const result: string[] = [];
    const queue = [targetId];

    while (queue.length > 0) {
        const current = queue.shift();
        for (const row of rows) {
            if (row.parentId === current && !result.includes(row.id)) {
                result.push(row.id);
                queue.push(row.id);
            }
        }
    }

    return result;
}

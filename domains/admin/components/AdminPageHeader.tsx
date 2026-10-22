// 관리자 페이지 상단 제목 영역 (제목 + 설명 + 오른쪽 버튼)
import Link from 'next/link';

interface AdminPageHeaderProps {
    title: string;
    description?: string;
    action?: { label: string; href: string }; // 예: 상품 등록 버튼
}

export default function AdminPageHeader({
    title,
    description,
    action,
}: AdminPageHeaderProps) {
    return (
        <div className="mb-6 flex items-end justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
                <h1 className="text-2xl font-black text-gray-900">{title}</h1>
                {description && (
                    <p className="mt-1 text-sm text-gray-500">{description}</p>
                )}
            </div>
            {action && (
                <Link
                    href={action.href}
                    className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}

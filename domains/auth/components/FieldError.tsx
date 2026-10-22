// 폼 입력칸 아래에 표시하는 필드별 에러 문구 (인증 폼 공용)
export default function FieldError({ message }: { message?: string }) {
    if (!message) return null;

    return <p className="-mt-1 text-xs text-red-500">{message}</p>;
}

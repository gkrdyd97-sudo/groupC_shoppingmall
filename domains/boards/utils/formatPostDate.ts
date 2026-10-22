// 게시글 작성일 표시 (서버 시간대와 관계없이 한국 시간 기준 "2026. 10. 22." 형태)
export function formatPostDate(value: string): string {
    return new Date(value).toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
    });
}

export type BoardId = 'qna' | 'notice';

export type PostStatus = '답변대기' | '답변완료';

export interface Post {
    id: number;
    title: string;
    contents: string;
    author: string;
    createdAt: string;
    views: number;
    status?: PostStatus;
}
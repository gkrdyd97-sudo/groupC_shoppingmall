'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useActionState, useState, useEffect } from 'react';
import { addCategoryAction } from '../actions/category.actions';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

interface FormState {
    name: string;
    parentId?: string;
}

const initialState = {
    name: '',
};

export default function CategoryForm() {
    const router = useRouter();

    const [form, setForm] = useState(initialState);

    const [state, formAction, isPending] = useActionState(
        addCategoryAction,
        INITIAL_ACTION_STATE,
    );

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        if (state.success) {
            alert('분류가 등록되었습니다.');

            router.replace('/admin/category');
            router.refresh();
        }
    }, [state.success, router]);
    return (
        <div>
            {!state.success && state.message && <div>{state.message}</div>}
            <form action={formAction} noValidate autoComplete="off">
                <div>
                    <label>분류명</label>
                    <Input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                    />
                </div>
                {state?.errors?.name && <div>{state.errors.name}</div>}

                <div>
                    <label>상위분류</label>
                    <select></select>
                </div>
                <Button type="submit" disabled={isPending}>
                    등록하기
                </Button>
            </form>
        </div>
    );
}

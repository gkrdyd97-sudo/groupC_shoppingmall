'use client';

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  getMyProfile,
  updateMyProfile,
} from '@/domains/auth/api/profiles';

type ProfileForm = {
  name: string;
  phone: string;
  gender: string;
};

export default function ProfileEditForm() {
  const [form, setForm] = useState<ProfileForm>({
    name: '',
    phone: '',
    gender: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getMyProfile();

        setForm({
          name: profile.name ?? '',
          phone: profile.phone ?? '',
          gender: profile.gender ?? '',
        });
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : '회원정보를 불러오지 못했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  const onChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const onSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage('');

    try {
      await updateMyProfile(form);
      setMessage('회원정보가 수정되었습니다.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : '회원정보 수정에 실패했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p>회원정보를 불러오는 중입니다...</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label htmlFor="name">이름</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label htmlFor="phone">전화번호</label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={onChange}
          required
        />
      </div>

      <div>
        <label htmlFor="gender">성별</label>
        <input
          id="gender"
          name="gender"
          value={form.gender}
          onChange={onChange}
        />
      </div>

      <button type="submit" disabled={isSaving}>
        {isSaving ? '저장 중...' : '회원정보 수정'}
      </button>

      {message && <p>{message}</p>}
    </form>
  );
}
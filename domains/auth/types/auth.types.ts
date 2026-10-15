export type LoginFormType = {
    email: string;
    password: string;
};

export type RegisterFormType = {
    email: string;
    password: string;
    passwordConfirm: string;
    name: string;
    agreeAll: boolean;
    agreeService: boolean;
    agreePrivacy: boolean;
};
export type AccountsType = {
    label: string;
    labelArray: labelArray[] | [];
    type: string;
    login: string;
    password: string | null;
    showPassword: boolean;
}

type labelArray = {
    text: string;
}

export type AccountsType = {
    label: string;
    labelObject: LabelObject[];
    type: string;
    login: number;
    password: string | null;
}

type LabelObject = {
    text: string;
}

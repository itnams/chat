export interface Chat {
    fullNamePartner?: string;
    partner?: string;
    messages: Messages[];
}
export interface Messages {
    id?: string;
    body?: string;
    sender?: string;
    time?: String;
}

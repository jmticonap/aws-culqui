export type CardType = {
    email: string;
    card_number: number;
    cvv: number;
    expiration_year: string;
    expiration_month: string;
};

export type CardResType = Omit<CardType, 'cvv'>;

export type CredentialType = {
    tokenKey: string;
    cardBody: CardType;
};

export type AnswerItem = {
    errorMessage: string;
    error: boolean;
};

export type AnswerChain = Array<AnswerItem>;

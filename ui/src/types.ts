export type config = {
    url?: string;
    categories?: {
        [category: string]: {
            images: number;
        };
    };
};

export type votes = {
    [category: string]: number[];
};

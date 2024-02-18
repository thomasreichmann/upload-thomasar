export type Upload = {
    title: string;
    url?: string;
};

export type GeneratePresignedUrlResponse = {
    url: string;
};

export type GeneratePresignedUrlRequest = {
    filename: string;
    contentType: string;
};

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
export type Adapter = 'fetch' | 'xml';

export interface UploadOptions {
    adapter: Adapter;
    doStreamUpload: boolean;
}

export class CanceledError extends Error {}

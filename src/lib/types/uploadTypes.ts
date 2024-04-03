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

export interface UploadStatus {
    uploading: boolean;
    uploaded: boolean;
    error: boolean;
    errorMessage: string;
    total: number; // bytes
    loaded: number; // bytes
    percentLoaded: number; // 0 to 1 for percentage
    estimatedSpeed: number; // bytes per second
    estimatedTimeLeft: number; // seconds
}

// Factory method to generate a default upload status
export function getDefaultUploadStatus(): UploadStatus {
    return {
        uploading: false,
        uploaded: false,
        error: false,
        errorMessage: '',
        total: 0,
        loaded: 0,
        percentLoaded: 0,
        estimatedSpeed: 0,
        estimatedTimeLeft: 0
    };
}

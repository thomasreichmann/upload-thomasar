import type { GeneratePresignedUrlResponse } from '$lib/types/uploadTypes';

export const getPresignedUrl = async (filename: string, contentType: string) => {
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: JSON.stringify({ filename, contentType })
    });

    if (!response.ok) {
        throw new Error('Failed to get presigned URL');
    }

    return (await response.json()) as Promise<GeneratePresignedUrlResponse>;
};

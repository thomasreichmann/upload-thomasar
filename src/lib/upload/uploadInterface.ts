import type { HttpMethod } from '@sveltejs/kit';

export type UploadEvent = 'progress' | 'complete' | 'error';

export interface UploadAdapter {
    upload(file: File, url: string, method: HttpMethod): Promise<void>;

    abort(): void;

    on(event: 'progress', handler: (progress: number) => void): this;

    on(event: 'complete', handler: (url: string) => void): this;

    on(event: 'error', handler: (error: Error) => void): this;
}

export type UploadEventHandler<T> = (event: T) => void;

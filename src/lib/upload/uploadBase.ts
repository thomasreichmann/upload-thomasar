import type { GeneratePresignedUrlResponse } from '$lib/types/uploadTypes';
import type { UploadAdapter, UploadEvent, UploadEventHandler } from '$lib/upload/uploadInterface';
import { FetchUploadAdapter } from '$lib/upload/adapters/fetchAdapter';

export class BaseUploadAdapter {
    private progressHandlers: UploadEventHandler<number>[] = [];
    private completeHandlers: UploadEventHandler<string>[] = [];
    private errorHandlers: UploadEventHandler<Error>[] = [];

    protected emitProgress(progress: number) {
        this.progressHandlers.forEach((handler) => handler(progress));
    }

    protected emitComplete(url: string) {
        this.completeHandlers.forEach((handler) => handler(url));
    }

    protected emitError(error: Error) {
        this.errorHandlers.forEach((handler) => handler(error));
    }

    public on(event: UploadEvent, handler: UploadEventHandler<never>) {
        switch (event) {
            case 'progress':
                this.progressHandlers.push(handler as UploadEventHandler<number>);
                break;
            case 'complete':
                this.completeHandlers.push(handler as UploadEventHandler<string>);
                break;
            case 'error':
                this.errorHandlers.push(handler as UploadEventHandler<Error>);
                break;
            default:
                throw new Error(`Unsupported event type: ${event}`);
        }

        return this; // For chaining
    }
}

export class UploadController {
    private uploadAdapter: UploadAdapter;

    constructor(uploadAdapter: UploadAdapter) {
        this.uploadAdapter = uploadAdapter;
    }

    public async upload(file: File) {
        const url = (await this.getPresignedUrl(file.name, file.type)).url;

        return this.uploadAdapter.upload(file, url, 'PUT');
    }

    public async abort() {
        this.uploadAdapter.abort();
    }

    private async getPresignedUrl(filename: string, contentType: string) {
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: JSON.stringify({ filename, contentType })
        });

        if (!response.ok) {
            throw new Error('Failed to get presigned URL');
        }

        return (await response.json()) as Promise<GeneratePresignedUrlResponse>;
    }
}

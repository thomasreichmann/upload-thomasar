import type { GeneratePresignedUrlResponse } from '$lib/types/uploadTypes';
import type { HttpMethod } from '@sveltejs/kit';

type UploadEvent = 'progress' | 'complete' | 'error';

interface UploadAdapter {
    upload(file: File, url: string, method: HttpMethod): Promise<unknown>;
    abort(): void;

    on(event: 'progress', handler: (progress: number) => void): void;
    on(event: 'complete', handler: (url: string) => void): void;
    on(event: 'error', handler: (error: string) => void): void;
}

type UploadEventHandler<T> = (event: T) => void;

export class BaseUploadAdapter {
    private progressHandlers: UploadEventHandler<number>[] = [];
    private completeHandlers: UploadEventHandler<string>[] = [];
    private errorHandlers: UploadEventHandler<string>[] = [];

    protected emitProgress(progress: number) {
        this.progressHandlers.forEach((handler) => handler(progress));
    }

    protected emitComplete(url: string) {
        this.completeHandlers.forEach((handler) => handler(url));
    }

    protected emitError(error: string) {
        this.errorHandlers.forEach((handler) => handler(error));
    }

    public on(event: 'progress', handler: UploadEventHandler<number>): this;
    public on(event: 'complete', handler: UploadEventHandler<string>): this;
    public on(event: 'error', handler: UploadEventHandler<string>): this;
    public on(event: UploadEvent, handler: UploadEventHandler<never>) {
        switch (event) {
            case 'progress':
                this.progressHandlers.push(handler as UploadEventHandler<number>);
                break;
            case 'complete':
                this.completeHandlers.push(handler as UploadEventHandler<string>);
                break;
            case 'error':
                this.errorHandlers.push(handler as UploadEventHandler<string>);
                break;
            default:
                throw new Error(`Unsupported event type: ${event}`);
        }

        return this; // For chaining
    }
}

export class FetchUploadAdapter extends BaseUploadAdapter implements UploadAdapter {
    constructor(
        private abortController?: AbortController,
        private shouldUseBlob: boolean = true
    ) {
        super();
    }

    public async upload(file: File, url: string, method: string = 'PUT') {
        try {
            // const body = this.shouldUseBlob
            //     ? file.stream().pipeThrough(new TextEncoderStream())
            //     : file;
            const stream = file.stream();

            const supportsRequestStreams = (() => {
                let duplexAccessed = false;

                const hasContentType = new Request('', {
                    body: new ReadableStream() as never,
                    method: 'PUT',
                    // @ts-expect-error Duplex is still not properly typed
                    get duplex() {
                        duplexAccessed = true;
                        return 'half';
                    }
                }).headers.has('Content-Type');

                return duplexAccessed && !hasContentType;
            })();

            console.log(supportsRequestStreams);

            const duplex = { duplex: 'half' };

            const response = await fetch(url, {
                method,
                body: stream,
                headers: {
                    'Content-Type': file.type
                },
                signal: this.abortController?.signal,
                ...duplex
            });

            console.log(response.type);

            // const data = await response.json();
            this.emitComplete('');
        } catch (error) {
            // Assuming error is of type Error for proper error message extraction
            this.emitError(error instanceof Error ? error.message : String(error));
        }
    }

    public abort(): void {
        this.abortController?.abort();
    }
}

export class UploadController {
    private uploadAdapter: UploadAdapter;

    constructor(uploadAdapter: UploadAdapter | null = null) {
        this.uploadAdapter = uploadAdapter ?? new FetchUploadAdapter();
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

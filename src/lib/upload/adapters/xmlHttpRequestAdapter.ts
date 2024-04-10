import { type HttpMethod } from '@sveltejs/kit';
import { BaseUploadAdapter } from '$lib/upload/uploadBase';
import type { UploadAdapter } from '$lib/upload/uploadInterface';
import { CanceledError } from '$lib/types/uploadTypes';

export class XmlHttpRequestAdapter extends BaseUploadAdapter implements UploadAdapter {
    private request: XMLHttpRequest | null = null;

    constructor() {
        super();
    }

    public async upload(file: File, url: string, method: HttpMethod = 'PUT'): Promise<void> {
        return new Promise((resolve) => {
            this.request = new XMLHttpRequest();

            this.request.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    this.emitProgress(event.loaded);
                }
            });

            this.request.addEventListener('loadend', () => {
                if (this.request?.status == 0) return; // Status 0 = request aborted

                this.emitComplete(this.request?.statusText || 'Upload completed');
                resolve();
            });

            this.request.addEventListener('error', () => {
                this.emitError(new Error(this.request?.statusText ?? 'Upload failed'));
                resolve();
            });

            this.request.addEventListener('abort', () => {
                this.emitError(new CanceledError());
            });

            this.request.open(method, url, true);
            this.request.setRequestHeader('Content-Type', file.type);
            this.request.send(file);
        });
    }

    public abort() {
        this.request?.abort();
    }
}

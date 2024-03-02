import type { HttpMethod } from '@sveltejs/kit';
import { BaseUploadAdapter } from '$lib/upload/uploadBase';
import type { UploadAdapter } from '$lib/upload/uploadInterface';

export class XmlHttpRequestAdapter extends BaseUploadAdapter implements UploadAdapter {
    private request: XMLHttpRequest | null = null;

    constructor() {
        super();
    }

    public async upload(file: File, url: string, method: HttpMethod = 'PUT'): Promise<unknown> {
        return new Promise((resolve) => {
            this.request = new XMLHttpRequest();

            this.request.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    console.log('upload progress:', event.loaded / event.total);
                    this.emitProgress(event.loaded / event.total);
                }
            });
            this.request.addEventListener('loadend', () => {
                resolve(this.request?.readyState === 4 && this.request.status === 200);
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

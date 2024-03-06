import { BaseUploadAdapter } from '$lib/upload/uploadBase';
import type { UploadAdapter } from '$lib/upload/uploadInterface';

export class FetchUploadAdapter extends BaseUploadAdapter implements UploadAdapter {
    constructor(
        private abortController?: AbortController,
        private shouldUseBlob: boolean = true
    ) {
        super();
    }

    public async upload(file: File, url: string, method: string = 'PUT') {
        try {
            const opt: { [key: string]: unknown } = {
                method,
                signal: this.abortController?.signal
            };

            // Decide if we are going to upload using stream or normal arrayBuffer
            if (this.shouldUseBlob) {
                opt.duplex = 'half';
                opt.body = file.stream();
            } else {
                opt.body = file;
            }

            // Use the loggedStream with the fetch request
            const res = await fetch(url, opt);

            console.log(res.type);
            this.emitComplete(res.statusText);
        } catch (error) {
            // Assuming error is of type Error for proper error message extraction
            this.emitError(error instanceof Error ? error.message : String(error));
        }
    }

    public abort(): void {
        this.abortController?.abort();
    }

    hasRequestStreamSupport() {
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
    }
}

import { BaseUploadAdapter } from '$lib/upload/uploadBase';
import type { UploadAdapter } from '$lib/upload/uploadInterface';
import { CanceledError } from '$lib/types/uploadTypes';

export class FetchUploadAdapter extends BaseUploadAdapter implements UploadAdapter {
    abortController = new AbortController();

    constructor(private shouldUseBlob: boolean = true) {
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

            this.emitComplete(res.statusText);
        } catch (error) {
            // Assuming error is of type Error for proper error message extraction
            if ((error as Error).name == 'AbortError') {
                this.emitError(new CanceledError());
            } else {
                console.log(error);
                this.emitError(error as Error);
            }
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

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
            // const duplex = { duplex: 'half' };

            const response = await fetch(url, {
                method,
                body: await file.arrayBuffer(),
                headers: {
                    'Content-Type': file.type
                },
                signal: this.abortController?.signal
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

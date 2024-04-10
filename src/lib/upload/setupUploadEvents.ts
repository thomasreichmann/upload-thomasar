import { CanceledError, getDefaultUploadStatus, type UploadStatus } from '$lib/types/uploadTypes';
import type { Writable } from 'svelte/store';
import type { UploadAdapter } from '$lib/upload/uploadInterface';

export function setupUploadEvents(
    adapter: UploadAdapter,
    file: File,
    uploadStatusStore: Writable<UploadStatus>
) {
    return adapter
        .on('error', (error: Error) => {
            if ((error as Error) instanceof CanceledError) {
                error.message = 'Upload aborted.';
            }

            uploadStatusStore.update((status) => ({
                ...status,
                error: true,
                uploading: false,
                errorMessage: error.message
            }));
        })
        .on('progress', (loaded) => {
            uploadStatusStore.update((status) => ({
                ...status,
                loaded: loaded,
                percentLoaded: loaded / file.size
            }));
        })
        .on('complete', () => {
            console.log(`upload complete`);
            uploadStatusStore.update(() => ({
                ...getDefaultUploadStatus(),
                uploading: false,
                uploaded: true
            }));
            console.log(`finished uploading`);
        });
}

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
                uploadStatusStore.set(getDefaultUploadStatus());
                return;
            }

            uploadStatusStore.update((status) => ({
                ...status,
                error: true,
                uploading: false,
                errorMessage: String(error)
            }));
            console.error(error);
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
            uploadStatusStore.update((status) => ({
                ...status,
                uploading: false,
                uploaded: true
            }));
            console.log(`finished uploading`);
        });
}

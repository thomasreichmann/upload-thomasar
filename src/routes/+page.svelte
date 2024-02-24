<script lang="ts">
    import type { Upload } from '$lib/types/uploadTypes';
    import ItemList from '$lib/components/ItemList.svelte';
    import { getPresignedUrl } from './uploadHelper';
    import axios, { CanceledError } from 'axios';
    import { FetchUploadAdapter, UploadController } from '$lib/uploadService';

    const abortController = new AbortController();

    const adapter = new FetchUploadAdapter(abortController)
        .on('error', (error) => {
            console.log(`error uploading`);

            if (error instanceof CanceledError) {
                uploadStatus = getDefaultUploadStatus();
                return;
            }

            uploadStatus.error = true;
            uploadStatus.uploading = false;
            console.error(error);
        })
        .on('progress', () => {
            console.log(`uploading...`);
        })
        .on('complete', () => {
            console.log(`upload complete`);
        });

    const uploadController = new UploadController(adapter);

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const getDefaultUploadStatus = () => {
        return {
            uploading: false,
            uploaded: false,
            error: false,
            // bytes
            total: 0,
            loaded: 0,
            // bytes per second
            estimatedSpeed: 0,
            // seconds
            estimatedTimeLeft: 0
        };
    };

    let uploadStatus = getDefaultUploadStatus();

    let items: Upload[] = [
        { title: 'upload item', url: '222222' },
        {
            title: 'upload itemupload itemupload itemupload itemupload itemupload item',
            url: '3333333'
        },
        { title: 'upload itemupload item', url: '44444444' }
    ];

    const onSelectFile = async (e: Event) => {
        const files = (e.target as HTMLInputElement).files;

        if (!files || files.length == 0) return;

        const file = files[0];

        uploadStatus.uploading = true;
        uploadStatus.total = file.size;

        await uploadController.upload(file);

        uploadStatus.uploading = false;
        uploadStatus.uploaded = true;

        console.log(`finished uploading`);
    };

    const abortUpload = () => {
        console.log(`aborting upload`);

        uploadController.abort();
        uploadStatus.uploading = false;
        uploadStatus.error = true;
    };
</script>

<main>
    {#if uploadStatus.uploading}
        <p>Uploading...</p>

        <pre>{formatBytes(uploadStatus.estimatedSpeed)}/s</pre>
        <pre>{formatBytes(uploadStatus.loaded)}/{formatBytes(uploadStatus.total)}</pre>
        <progress value={uploadStatus.loaded} max={uploadStatus.total}></progress>
        <pre>estimated time left: {Math.floor(uploadStatus.estimatedTimeLeft)}s</pre>
        <button id="cancel-button" on:click={abortUpload}>cancel</button>
    {:else if uploadStatus.uploaded}
        <p>Uploaded!</p>
    {:else if uploadStatus.error}
        <p>Error uploading</p>
    {/if}
    {#if !uploadStatus.uploading}
        <form>
            <label id="file-upload-label" for="upload-button">Upload</label>
            <input type="file" name="file" id="upload-button" on:change={onSelectFile} />
        </form>
    {/if}

    <ItemList {items} onClose={console.log} />
</main>

<style>
    input[type='file'] {
        display: none;
    }

    #cancel-button {
        background-color: #650d1b;

        border-radius: 16px;
        padding: 5px 10px;

        font-size: 2em;

        transition: background-color ease 100ms;

        cursor: pointer;

        &:hover {
            background-color: #5b0b18;
        }
    }

    #file-upload-label {
        background-color: #650d1b;

        border-radius: 16px;
        padding: 5px 10px;

        font-size: 2em;

        transition: background-color ease 100ms;

        cursor: pointer;

        &:hover {
            background-color: #5b0b18;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        gap: 24px;
    }

    :global(button) {
        border: none;
        color: #ffffff;
        cursor: pointer;
    }

    :global(body) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        height: 100vh;
        width: 100vw;

        background-color: #211a1e;

        color: aliceblue;
        font-family: Roboto, sans-serif;
    }
</style>

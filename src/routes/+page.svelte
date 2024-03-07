<script lang="ts">
    import type { Upload } from '$lib/types/uploadTypes';
    import { CanceledError } from 'axios';
    import { FetchUploadAdapter } from '$lib/upload/adapters/fetchAdapter';
    import { XmlHttpRequestAdapter } from '$lib/upload/adapters/xmlHttpRequestAdapter';
    import { UploadController } from '$lib/upload/uploadBase';
    import { FileButton } from '@skeletonlabs/skeleton';
    import ItemList from '$lib/components/ItemList.svelte';

    const abortController = new AbortController();
    let uploadController: UploadController;

    type Adapters = 'fetch' | 'xml';

    let chosenAdapter: Adapters = 'fetch';

    const getAdapter = (chosenAdapter: Adapters) => {
        if (chosenAdapter == 'xml') {
            return new XmlHttpRequestAdapter();
        } else {
            return new FetchUploadAdapter(abortController, false);
        }
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PiB', 'EiB', 'ZiB', 'YiB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const getDefaultUploadStatus = () => {
        return {
            uploading: false,
            uploaded: false,
            error: false,
            errorMessage: '',
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

    let files: FileList;

    $: if (files) {
        const file = files[0];

        uploadStatus.uploading = true;
        uploadStatus.total = file.size;

        // TODO: separate this for better readability

        let adapter = getAdapter(chosenAdapter);

        adapter
            ?.on('error', (error: unknown) => {
                console.log(`error uploading`);

                if (error instanceof CanceledError) {
                    uploadStatus = getDefaultUploadStatus();
                    return;
                }

                uploadStatus.error = true;
                uploadStatus.uploading = false;
                uploadStatus.errorMessage = String(error);
                console.error(error);
            })
            .on('progress', (progress) => {
                console.log(`uploading... : ${progress}`);
            })
            .on('complete', () => {
                console.log(`upload complete`);

                uploadStatus.uploading = false;
                uploadStatus.uploaded = true;

                console.log(`finished uploading`);
            });

        uploadController = new UploadController(adapter);

        uploadController.upload(file).then(console.log);
    }

    const abortUpload = () => {
        console.log(`aborting upload`);

        uploadController?.abort();

        uploadStatus = getDefaultUploadStatus();
    };
</script>

<main>
    {#if uploadStatus.uploading}
        <p>Uploading...</p>

        <pre>{formatBytes(uploadStatus.estimatedSpeed)}/s</pre>
        <pre>{formatBytes(uploadStatus.loaded)}/{formatBytes(uploadStatus.total)}</pre>
        <progress value={uploadStatus.loaded} max={uploadStatus.total}></progress>
        <pre>estimated time left: {Math.floor(uploadStatus.estimatedTimeLeft)}s</pre>
        <button class="btn-base" id="cancel-button" on:click={abortUpload}>cancel</button>
    {:else if uploadStatus.uploaded}
        <p>Uploaded!</p>
    {:else if uploadStatus.error}
        <p>Error uploading</p>
        <pre>{uploadStatus.errorMessage}</pre>
    {/if}
    {#if !uploadStatus.uploading}
        <form>
            <FileButton name="upload-button" bind:files>Upload</FileButton>
            <select bind:value={chosenAdapter}>
                <option value="fetch">Fetch</option>
                <option value="xml">XML</option>
            </select>
        </form>
    {/if}

    <ItemList {items} on:close={console.log} />
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        gap: 24px;
        height: 100vh;
        width: 100vw;
    }
</style>

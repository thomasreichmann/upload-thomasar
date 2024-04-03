<script lang="ts">
    import {
        type Adapter,
        CanceledError,
        type Upload,
        type UploadOptions
    } from '$lib/types/uploadTypes';
    import { FetchUploadAdapter } from '$lib/upload/adapters/fetchAdapter';
    import { XmlHttpRequestAdapter } from '$lib/upload/adapters/xmlHttpRequestAdapter';
    import { UploadController } from '$lib/upload/uploadBase';
    import { FileButton } from '@skeletonlabs/skeleton';
    import ItemList from '$lib/components/ItemList.svelte';
    import AdvancedOptions from '$lib/components/AdvancedOptions.svelte';

    let uploadController: UploadController;

    let options: UploadOptions = {
        doStreamUpload: false,
        adapter: 'xml'
    };

    const getAdapter = (chosenAdapter: Adapter) => {
        if (chosenAdapter == 'xml') {
            return new XmlHttpRequestAdapter();
        } else {
            return new FetchUploadAdapter(options.doStreamUpload);
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
            percentLoaded: 0,
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

    let files: File[];

    function uploadFiles(files: File[]) {
        console.log(`files changed: ${files.length}, ${JSON.stringify(files)}`);

        // TODO: Refactor this to accept multiple files, for now we will just take the first one
        const file = files[0];

        uploadStatus.uploading = true;
        uploadStatus.total = file.size;

        const adapter = getAdapter(options.adapter);

        adapter
            ?.on('error', (error) => {
                if ((error as Error) instanceof CanceledError) {
                    uploadStatus = getDefaultUploadStatus();
                    return;
                }

                uploadStatus.error = true;
                uploadStatus.uploading = false;
                uploadStatus.errorMessage = String(error);
                console.error(error);
            })
            .on('progress', (loaded) => {
                uploadStatus.loaded = loaded;
                uploadStatus.percentLoaded = loaded / file.size;
            })
            .on('complete', () => {
                console.log(`upload complete`);
                uploadStatus.uploading = false;
                uploadStatus.uploaded = true;
                console.log(`finished uploading`);
            });

        uploadController = new UploadController(adapter);
        uploadController.upload(file);
    }

    $: if (files) {
        uploadFiles(files);
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
        <progress class="w-[50%]" value={uploadStatus.percentLoaded} max={1}></progress>
        <pre>estimated time left: {Math.floor(uploadStatus.estimatedTimeLeft)}s</pre>
        <button class="btn-base" id="cancel-button" on:click={abortUpload}>cancel</button>
    {:else if uploadStatus.uploaded}
        <p>Uploaded!</p>
    {:else if uploadStatus.error}
        <p>Error uploading</p>
        <pre>{uploadStatus.errorMessage}</pre>
    {/if}
    <div class="flex justify-center">
        <form class="flex items-start justify-center gap-4">
            <div class="invisible w-[200px]" />

            <div class="shrink-0">
                <FileButton name="upload-button" bind:files>Upload</FileButton>
            </div>

            <div class="w-[200px] shrink-0 basis-auto">
                <AdvancedOptions bind:options />
            </div>
        </form>
    </div>

    <pre>{JSON.stringify(options)}</pre>

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

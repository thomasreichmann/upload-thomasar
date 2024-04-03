<script lang="ts">
    import {
        type Adapter,
        getDefaultUploadStatus,
        type Upload,
        type UploadOptions
    } from '$lib/types/uploadTypes';
    import { FetchUploadAdapter } from '$lib/upload/adapters/fetchAdapter';
    import { XmlHttpRequestAdapter } from '$lib/upload/adapters/xmlHttpRequestAdapter';
    import { UploadController } from '$lib/upload/uploadBase';
    import { FileButton } from '@skeletonlabs/skeleton';
    import ItemList from '$lib/components/ItemList.svelte';
    import AdvancedOptions from '$lib/components/AdvancedOptions.svelte';
    import { formatBytes } from '$lib';
    import { setupUploadEvents } from '$lib/upload/setupUploadEvents';
    import { writable } from 'svelte/store';

    let uploadStatus = writable(getDefaultUploadStatus()); // Use a writable store

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

    let items: Upload[] = [
        { title: 'upload item', url: '222222' },
        {
            title: 'upload itemupload itemupload itemupload itemupload itemupload item',
            url: '3333333'
        },
        { title: 'upload itemupload item', url: '44444444' }
    ];

    let files: FileList;

    function uploadFiles(files: FileList) {
        console.log('Files changed');
        // TODO: Refactor this to accept multiple files, for now we will just take the first one
        const file = files[0];

        uploadStatus.update((status) => {
            return {
                ...status,
                total: file.size,
                uploading: true
            };
        });

        const adapter = setupUploadEvents(getAdapter(options.adapter), file, uploadStatus);

        uploadController = new UploadController(adapter);

        uploadController.upload(file);
    }

    $: if (files) {
        uploadFiles(files);
    }

    const abortUpload = () => {
        uploadController?.abort();

        uploadStatus.set(getDefaultUploadStatus());
    };
</script>

<main>
    <pre>{JSON.stringify($uploadStatus)}</pre>
    {#if $uploadStatus.uploading}
        <p>Uploading...</p>

        <pre>{formatBytes($uploadStatus.estimatedSpeed)}/s</pre>
        <pre>{formatBytes($uploadStatus.loaded)}/{formatBytes($uploadStatus.total)}</pre>
        <progress class="w-[50%]" value={$uploadStatus.percentLoaded} max={1}></progress>
        <pre>estimated time left: {Math.floor($uploadStatus.estimatedTimeLeft)}s</pre>
        <button class="btn-base" id="cancel-button" on:click={abortUpload}>cancel</button>
    {:else if $uploadStatus.uploaded}
        <p>Uploaded!</p>
    {:else if $uploadStatus.error}
        <p>Error uploading</p>
        <pre>{$uploadStatus.errorMessage}</pre>
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

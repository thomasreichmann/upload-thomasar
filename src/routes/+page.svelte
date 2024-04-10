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
    import { setupUploadEvents } from '$lib/upload/setupUploadEvents';
    import { writable } from 'svelte/store';
    import UploadStatusDisplay from '$lib/components/upload/UploadStatusDisplay.svelte';

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

    let files: FileList | undefined;

    function uploadFiles(fileList: FileList) {
        // TODO: Refactor this to accept multiple files, for now we will just take the first one
        const file = fileList[0];

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
        console.log('Files changed', files.length);
        if (files.length) uploadFiles(files);
        else console.log('skipped upload because fileList was empty');
    }

    const abortUpload = () => {
        uploadController?.abort();
        files = undefined;
    };
</script>

<main>
    <UploadStatusDisplay uploadStatus={$uploadStatus} />

    <div class="flex justify-center">
        <form class="flex items-start justify-center gap-4">
            <div class="invisible w-[200px]" />

            <div class="shrink-0">
                {#if !$uploadStatus.uploading}
                    <FileButton name="upload-button" bind:files>Upload</FileButton>
                {:else}
                    <button class="btn-base" id="cancel-button" on:click={abortUpload}>
                        Cancel
                    </button>
                {/if}
            </div>

            <div class="w-[200px] shrink-0 basis-auto">
                <AdvancedOptions bind:options />
            </div>
        </form>
    </div>

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

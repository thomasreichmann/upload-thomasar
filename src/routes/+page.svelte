<script lang="ts">
    import type { Adapter, Upload } from '$lib/types/uploadTypes';
    import { CanceledError } from 'axios';
    import { FetchUploadAdapter } from '$lib/upload/adapters/fetchAdapter';
    import { XmlHttpRequestAdapter } from '$lib/upload/adapters/xmlHttpRequestAdapter';
    import { UploadController } from '$lib/upload/uploadBase';
    import { Accordion, AccordionItem, FileButton } from '@skeletonlabs/skeleton';
    import ItemList from '$lib/components/ItemList.svelte';
    import { slide } from 'svelte/transition';

    const abortController = new AbortController();
    let uploadController: UploadController;

    let chosenAdapter: Adapter = 'fetch';

    const getAdapter = (chosenAdapter: Adapter) => {
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
    <div class="flex justify-center">
        <form class="flex items-start justify-center gap-4">
            <div class="invisible w-[200px]" />

            <div class="shrink-0">
                <FileButton name="upload-button" bind:files>Upload</FileButton>
            </div>

            <div class="w-[200px] shrink-0 basis-auto">
                <Accordion>
                    <AccordionItem open>
                        <svelte:fragment slot="summary">Advanced options</svelte:fragment>
                        <svelte:fragment slot="content">
                            <div class="space-y-4">
                                <label for="adapter-select" class="label">
                                    <span class="text-sm">Upload adapter</span>
                                    <select
                                        name="adapter-select"
                                        id="adapter-select"
                                        class="select"
                                        bind:value={chosenAdapter}
                                    >
                                        <option value="fetch">Fetch</option>
                                        <option value="xml">XML</option>
                                    </select>
                                </label>

                                {#if chosenAdapter === 'fetch'}
                                    <label
                                        class="flex items-center space-x-2"
                                        transition:slide={{ duration: 250 }}
                                    >
                                        <input class="checkbox" type="checkbox" checked />
                                        <span class="text-sm">Use blob</span>
                                    </label>
                                {/if}
                            </div>
                        </svelte:fragment>
                    </AccordionItem>
                </Accordion>
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

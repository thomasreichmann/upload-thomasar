<script lang="ts">
    import type { Upload } from '$lib/types/uploadTypes';
    import ItemList from '$lib/components/ItemList.svelte';
    import { enhance } from '$app/forms';
    let form: HTMLFormElement;

    let items: Upload[] = [
        { title: 'upload item', url: '222222' },
        {
            title: 'upload itemupload itemupload itemupload itemupload itemupload item',
            url: '3333333'
        },
        { title: 'upload itemupload item', url: '44444444' }
    ];
    const onSelectFile = (e: Event) => {
        const files = (e.target as HTMLInputElement).files;

        if (!files || files.length == 0) return;

        const file = files[0];
        form.requestSubmit();

        // Send file data to upload endpoint.
    };
</script>

<main>
    <form method="post" bind:this={form} use:enhance>
        <label id="file-upload-label" for="upload-button">Upload</label>
        <input type="file" name="file" id="upload-button" on:change={onSelectFile} />
    </form>

    <ItemList {items} onClose={console.log} />
</main>

<style>
    input[type='file'] {
        display: none;
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

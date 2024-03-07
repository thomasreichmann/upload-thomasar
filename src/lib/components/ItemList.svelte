<script lang="ts">
    import type { Upload } from '$lib/types/uploadTypes';
    import CloseIcon from '$lib/components/icons/CloseIcon.svelte';
    import LinkIcon from '$lib/components/icons/LinkIcon.svelte';
    import IconButton from '$lib/components/IconButton.svelte';
    import { createEventDispatcher } from 'svelte';
    export let items: Upload[];

    const dispatch = createEventDispatcher();

    const onClose = (upload: Upload) => {
        dispatch('close', upload);
    };
</script>

<ul class="flex flex-col gap-1.5 max-w-[75vw] p-0 list-none">
    {#each items as item}
        <li class="flex justify-between items-center gap-2 p-1.5 pl-3 rounded-2xl overflow-hidden bg-primary-500">
            <a href={item.url} target="_blank" class="no-underline overflow-hidden text-ellipsis whitespace-nowrap"> {item.title} </a>
            <div class="flex">
                <IconButton
                    on:click={() => {
                        navigator.clipboard.writeText(item.url ?? '');
                    }}
                >
                    <LinkIcon />
                </IconButton>
                <IconButton
                    on:click={() => {
                        onClose(item);
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </div>
        </li>
    {/each}
</ul>

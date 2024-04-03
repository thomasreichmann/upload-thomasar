<script lang="ts">
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import type { UploadOptions } from '$lib/types/uploadTypes';
    import { slide } from 'svelte/transition';

    export let options: Partial<UploadOptions> = {};
</script>

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
                        bind:value={options.adapter}
                    >
                        <option value="fetch">Fetch</option>
                        <option value="xml">XML</option>
                    </select>
                </label>

                {#if options.adapter === 'fetch'}
                    <label class="flex items-center space-x-2" transition:slide={{ duration: 250 }}>
                        <input
                            class="checkbox"
                            type="checkbox"
                            bind:checked={options.doStreamUpload}
                        />
                        <span class="text-sm">Use blob</span>
                    </label>
                {/if}
            </div>
        </svelte:fragment>
    </AccordionItem>
</Accordion>

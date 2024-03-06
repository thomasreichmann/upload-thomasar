<script lang="ts">
    import type { Upload } from '$lib/types/uploadTypes';
    type CloseCallback = (upload: Upload) => void;

    export let onClose: CloseCallback;
    export let items: Upload[];
</script>

<ul>
    {#each items as item}
        <li>
            <a href={item.url} target="_blank" class="list-text">{item.title}</a>
            <div>
                <button
                    on:click={() => {
                        navigator.clipboard.writeText(item.url ?? '');
                    }}
                >
                    🔗
                </button>
                <button
                    on:click={() => {
                        onClose(item);
                    }}
                >
                    ✖️
                </button>
            </div>
        </li>
    {/each}
</ul>

<style>
    a {
        text-decoration: none;
    }

    ul {
        padding-left: 0;
        list-style-type: none;
        /*text-align: center;*/
        display: flex;
        flex-direction: column;
        gap: 6px;

        max-width: 75vw;
    }

    li {
        padding: 5px 10px;
        border-radius: 15px;

        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        background-color: #9b3d12;

        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
    }

    li button {
        padding: 2px;
        border-radius: 50%;

        background-color: inherit;

        &:hover {
            background-color: #80330f;
        }
    }

    li .list-text {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

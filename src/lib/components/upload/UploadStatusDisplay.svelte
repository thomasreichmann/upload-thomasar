<script lang="ts">
    import { formatBytes } from '$lib';
    import type { UploadStatus } from '$lib/types/uploadTypes';

    export let uploadStatus: UploadStatus;
</script>

{#if uploadStatus.uploading}
    <p>Uploading...</p>

    <pre>{formatBytes(uploadStatus.estimatedSpeed)}/s</pre>
    <pre>{formatBytes(uploadStatus.loaded)}/{formatBytes(uploadStatus.total)}</pre>
    <progress class="w-[50%]" value={uploadStatus.percentLoaded} max={1}></progress>
    <pre>estimated time left: {Math.floor(uploadStatus.estimatedTimeLeft)}s</pre>
{:else if uploadStatus.uploaded}
    <p>Uploaded!</p>
{:else if uploadStatus.error}
    <p>Error uploading</p>
    <pre>{uploadStatus.errorMessage}</pre>
{/if}

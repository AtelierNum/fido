<script>
	import { onMount } from "svelte";

	export let ipcRenderer;

	let settings = null;

	onMount(async () => {
		settings = await ipcRenderer.invoke("get_settings");
	})

	const onChange = () => {
		ipcRenderer.invoke("update_settings", {settings})
	};
</script>

<style>
	fieldset {
		border: 0;
	}

	input, label {
		display: inline;
	}

	#container > *{
		margin-top: 1em;
	}
</style>

<div id="container">
	{#if settings}
	<fieldset>
		<label>Always ask where to download :</label>
		<input type="checkbox" bind:checked={settings.alwaysAskTargetDir} on:change={onChange}/>
	</fieldset>
	{#if !settings.alwaysAskTargetDir}
		<fieldset>
			<label>Download directory :</label>
			{settings.targetDir}
			<button
				on:click={async () => {
					const selectedDir = await ipcRenderer.invoke('select_target_dir');
					settings.targetDir = selectedDir;
					ipcRenderer.invoke("update_settings", {settings});
				}}>
				Change
			</button>
		</fieldset>
	{/if}
	<fieldset>
		<label>Open in file explorer after download :</label>
		<input type="checkbox" bind:checked={settings.openInExplorerAfterDownload} on:change={onChange}/>
	</fieldset>
	<fieldset>
		<label>Cache downloads :</label>
		<input type="checkbox" bind:checked={settings.cacheDownloads} on:change={onChange}/>
	</fieldset>
	{/if}
</div>
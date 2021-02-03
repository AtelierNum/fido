<script>
	import { onMount } from "svelte";

	export let ipcRenderer;

	let settings = null;

	onMount(async () => {
		settings = await ipcRenderer.invoke("get_settings");
	});

	const onChange = () => {
		console.log("settings changed");
		ipcRenderer.invoke("update_settings", { settings });
	};
</script>

<style>
	fieldset {
		border: 0;
	}

	input,
	label {
		display: inline;
	}

	#container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#container > * {
		margin-top: 1em;
	}
</style>

<div id="container">
	<section>
		{#if settings}
			<fieldset>
				<label>Theme :</label>
				<select bind:value={settings.theme} on:change={onChange}>
					<option value="system">Same as OS</option>
					<option value="dark">Dark</option>
					<option value="light">Light</option>
				</select>
			</fieldset>
			<fieldset>
				<label>Always ask where to download :</label>
				<input
					type="checkbox"
					bind:checked={settings.alwaysAskTargetDir}
					on:change={onChange}
				/>
			</fieldset>
			{#if !settings.alwaysAskTargetDir}
				<fieldset>
					<label>Download directory :</label>
					{settings.targetDir}
					<button
						on:click={async () => {
							const selectedDir = await ipcRenderer.invoke("select_target_dir");
							settings.targetDir = selectedDir;
							ipcRenderer.invoke("update_settings", { settings });
						}}> Change </button>
				</fieldset>
			{/if}
			<fieldset>
				<label>Open in file explorer after download :</label>
				<input
					type="checkbox"
					bind:checked={settings.openInExplorerAfterDownload}
					on:change={onChange}
				/>
			</fieldset>
			<fieldset>
				<label>Cache downloads :</label>
				<input type="checkbox" bind:checked={settings.cacheDownloads} on:change={onChange} />
			</fieldset>
		{/if}
	</section>
</div>

<script>
	import { focusedGitHubPath, focusedPathisLeaf, toastMsg } from "./../store";

	export let ipcRenderer;
	export let pageName;

	let info = "";
	let settingsOpen = false;
	let dlTarget;
	let _downloadTargetWatcher = focusedGitHubPath.subscribe(value => {
		dlTarget = value;
	});

	function download(contentPath) {
		ipcRenderer.on("update", onUpdate);
		ipcRenderer.invoke("download", { path: contentPath });
	}

	function onUpdate(args) {
		info = args.info;
		toastMsg.update(() => "download completed");
	}
</script>

<style>
	span {
		flex: 1;
	}

	#container {
		height: 3em;
		width: 100%;
		background-color: #555;
		color: white;
		display: flex;
		align-items: center;
	}

	#container > * {
		padding: 0 1em;
	}

	.icon {
		width: 1em;
	}
</style>

<nav id="container">
	{#if !settingsOpen}
		<button
			disabled={!$focusedPathisLeaf}
			on:click={() => {
				download(dlTarget);
			}}> Download </button>
	{/if}
	<span />
	<div
		on:click={() => {
			if (settingsOpen) {
				pageName = "repos";
				settingsOpen = false;
			} else {
				pageName = "settings";
				settingsOpen = true;
			}
		}}
	>
		{#if settingsOpen}
			<img src="assets/icons/arrow-left.svg" class="icon" alt="Link to go back" />
		{:else}
			<img src="assets/icons/cog.svg" class="icon" alt="Link to the settings page" />
		{/if}
	</div>
</nav>

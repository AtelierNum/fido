<script>
	import Fa from "svelte-fa";
	import { faCog, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
		height: 100%;
		width: 100%;
		background-color: var(--paper-3);
		display: flex;
		align-items: center;
	}

	#container > * {
		padding: 0 1em;
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
			<Fa icon={faArrowLeft} />
		{:else}
			<Fa icon={faCog} />
		{/if}
	</div>
</nav>

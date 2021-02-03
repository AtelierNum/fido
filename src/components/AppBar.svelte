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
	let downloadBtnDisabled = !$focusedPathisLeaf;

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

	button {
		display: inline-block;
		cursor: pointer;
		color: var(--color-primary-text);
		background-color: var(--color-primary);
		border: 1px solid transparent;
		line-height: 1.5;
		text-align: center;
		text-decoration: none;
		vertical-align: middle;
		user-select: none;
		padding: 0.375rem 0.75rem;
		font-size: 1rem;
		border-radius: 0.25rem;
	}

	.disabled {
		color: var(--color-disabled-text);
		background-color: var(--color-disabled);
	}

	#container {
		height: 100%;
		width: 100%;
		background-color: var(--paper-3);
		display: flex;
		align-items: center;
	}

	#container > * {
		margin: 0 1em;
	}
</style>

<nav id="container">
	{#if !settingsOpen}
		<button
			disabled={!$focusedPathisLeaf}
			class:disabled={!$focusedPathisLeaf}
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

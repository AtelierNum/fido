<script>
	import Fa from "svelte-fa";
	import { faCog, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
	import { tweened } from "svelte/motion";
	import { cubicInOut } from "svelte/easing";

	import { focusedGitHubPath, focusedPathisLeaf, addToast } from "./../store";

	export let ipcRenderer;
	export let pageName;

	let downloading = false;
	let info = "";
	let settingsOpen = false;
	let dlTarget;
	let _downloadTargetWatcher = focusedGitHubPath.subscribe(value => {
		dlTarget = value;
	});
	const downloadSteps = 4;
	let dlProgress = 0;
	const progressWidth = tweened(0, {
		duration: 400,
		easing: cubicInOut,
	});

	function download(contentPath) {
		downloading = true;
		ipcRenderer.on("update", data => {
			dlProgress += 100 / downloadSteps;
			updateProgressBar();
			console.log("update: ", data);
		});
		ipcRenderer.invoke("download", { path: contentPath }).then(err => {
			downloading = false;
			dlProgress = 0;
			updateProgressBar();
			return err
				? addToast({
						type: "error",
						message: err,
				  })
				: addToast({
						type: "success",
						message: "download completed",
				  });
		});
	}

	function updateProgressBar() {
		progressWidth.set(dlProgress);
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

	button.secondary {
		color: var(--color-text);
		background-color: transparent;
	}

	.disabled {
		color: var(--color-disabled-text);
		background-color: var(--color-disabled);
		border: 1px dashed;
		border-color: var(--color-disabled-text);
	}

	#container {
		z-index: 2;
	}

	#bar {
		height: 100%;
		width: 100%;
		background-color: var(--paper-3);
		display: flex;
		align-items: center;
		padding: var(--size-2);
	}

	#bar > * {
		margin: 0 1em;
	}

	#progress {
		height: var(--size-1);
		background-color: var(--color-primary);
	}
</style>

<div id="container">
	<nav id="bar">
		{#if !settingsOpen}
			<button
				disabled={!$focusedPathisLeaf || downloading}
				class:disabled={!$focusedPathisLeaf || downloading}
				on:click={() => {
					download(dlTarget);
				}}> Download </button>
		{/if}
		<span />
		<button
			class="secondary"
			on:click={() => {
				if (settingsOpen) {
					pageName = "repos";
					settingsOpen = false;
				} else {
					pageName = "settings";
					settingsOpen = true;
				}
			}}>
			{#if settingsOpen}
				<Fa icon={faArrowLeft} />
			{:else}
				<Fa icon={faCog} />
			{/if}
		</button>
	</nav>
	{#if downloading}
		<div id="progress" style={`width:${$progressWidth}%`} />
	{/if}
</div>

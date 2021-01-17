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
span{
	flex: 1;
}

#container {
	height: 3em;
	width: 100%;
	background-color : #555;
	color: white;
	display: flex;
	align-items: center;
}
</style>

<nav id="container">
	{#if !settingsOpen}
	<button
		disabled={!$focusedPathisLeaf}
		on:click={() => {
			download(dlTarget);
		}}>
		Download
	</button>
	{/if}
	<span/>
	<div on:click={() => {
		if(settingsOpen){
			pageName = "repos";
			settingsOpen = false;
		}else{
			pageName = "settings";
			settingsOpen = true;
		}
		settingsOpen ? "repos" : "settings"
		}}>
		{#if settingsOpen}
			<div>repos</div>
		{:else}
			<div>settings</div>
		{/if}
	</div>
</nav>
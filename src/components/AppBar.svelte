<script>
	import { focusedGitHubPath, focusedPathisLeaf, toastMsg } from "./../store";

	export let ipcRenderer;

	let info = "";
	let dlTarget;
	let downloadTargetWatcher = focusedGitHubPath.subscribe(value => {
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

<div id="container">
	<button
		disabled={!$focusedPathisLeaf}
		on:click={() => {
			download(dlTarget);
		}}>
		Download
	</button>
	<span/>
	<div>preferences</div>
</div>
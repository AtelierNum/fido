<script>
	import { focusedGitHubPath, focusedPathisLeaf,  toastMsg} from "./store";
	import { onMount } from "svelte";
	import Repos from "./pages/Repos.svelte";
	import Toaster from "./components/Toaster.svelte"
	
	export let ipcRenderer;

	let info = "";
	let dlTarget;
	let downloadTargetWatcher = focusedGitHubPath.subscribe(value => {dlTarget = value});

	function download(contentPath){
		ipcRenderer.on("update",onUpdate);
		ipcRenderer.invoke("download",{path:contentPath});
	}

	function onUpdate(args){
		info = args.info;
		toastMsg.update(() => "download completed")
	}

	onMount(async () => {
		ipcRenderer.invoke("get_target_dir").then(target_dir => info = target_dir);
	})
</script>

<main>
	<Repos/>
	<div class="downloadInteraction">
		<Toaster/>
		<button 
		disabled={!$focusedPathisLeaf}
		on:click={() => {download(dlTarget)}}>
		Download
		</button>
		<button on:click={() => {ipcRenderer.invoke("select_target_dir").then((selectedDir => info = selectedDir))}}>select download directory</button>	
	</div>
</main>

<style>
	main {
		max-width: 100%;
		width: 100%;
		height: 100%;
	}

	.downloadInteraction{
		position: fixed;
		right: 20px;
		bottom: 20px;
		display: flex;
		flex-direction: column;
		background-color: ivory;
	}
</style>
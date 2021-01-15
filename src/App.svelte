<script>
	import { focusedGitHubPath, focusedPathisLeaf, toastMsg } from "./store";
	import { onMount } from "svelte";
	import AppBar from "./components/AppBar.svelte";
	import Repos from "./pages/Repos.svelte";
	import Toaster from "./components/Toaster.svelte";

	export let ipcRenderer;

	let info = "";

	onMount(async () => {
		ipcRenderer
			.invoke("get_target_dir")
			.then(target_dir => (info = target_dir));
	});
</script>

<style>
	main {
		max-width: 100%;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template: auto 1fr / 1fr;
	}

	.downloadInteraction {
		position: fixed;
		right: 20px;
		bottom: 20px;
		display: flex;
		flex-direction: column;
		background-color: ivory;
	}
</style>

<main>
	<AppBar {ipcRenderer}/>
	<Repos />
	<Toaster />
	<div class="downloadInteraction">
		<button
			on:click={() => {
				ipcRenderer
					.invoke('select_target_dir')
					.then(selectedDir => (info = selectedDir));
			}}>select download directory
		</button>
	</div>
</main>

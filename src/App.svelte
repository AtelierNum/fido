<script>
	import { onMount } from "svelte";
	import Repos from "./pages/Repos.svelte";
	import Templates from "./pages/Templates.svelte";
	import Save from "./pages/Save.svelte";
	

	const pageMap = {
		repos: Repos,
		templates: Templates,
		save: Save
	}
	
	export let name;
	export let ipcRenderer;

	let pageName = "repos";

	let info = "";

	function download(){
		ipcRenderer.on("update",onUpdate);
		ipcRenderer.invoke("download",{arg1:"I am arg1",arg2:"and I am args2"});
	}

	function onUpdate(args){
		info = args.info;
	}

	onMount(async () => {
		ipcRenderer.invoke("get_target_dir").then(target_dir => info = target_dir);
	})
</script>

<main>
	{#if  Object.keys(pageMap).includes(pageName)}
		<svelte:component this={pageMap[pageName]} bind:pageName/>
	{:else}
		<h1>Ah ...</h1>
	{/if}
	<h1>Hello {name}!</h1>
	<p>{info}</p>
	<button on:click={download}>download some shit</button>
	<button on:click={() => {pageName = "repos"}}>go to repo selection</button>
	<button on:click={() => {ipcRenderer.invoke("select_target_dir").then((selectedDir => info = selectedDir))}}>select download directory</button>
</main>

<style>
	main {
		max-width: 100%;
		width: 100%;
		height: 100%;
	}
	/* h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	} */
</style>
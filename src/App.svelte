<script>
	import Repos from "./pages/Repos.svelte";

	const pageMap = {
		repos: Repos
	}
	
	export let name;
	export let ipcRenderer;

	let pageName = "index";

	let info = "";

	function download(){
		ipcRenderer.on("update",onUpdate);
		ipcRenderer.invoke("download",{arg1:"I am arg1",arg2:"and I am args2"});
	}

	function onUpdate(args){
		info = args.info;
	}
</script>

<main>
	{#if  Object.keys(pageMap).includes(pageName)}
		<svelte:component this={pageMap[pageName]} bind:pageName/>
	{:else}
		<h1>404</h1>
	{/if}
	<h1>Hello {name}!</h1>
	<p>{info}</p>
	<button on:click={download}>download some shit</button>
	<button on:click={() => {pageName = "repos"}}></button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
<script>
	import AppBar from "./components/AppBar.svelte";
	import Toaster from "./components/Toaster.svelte";

	import Repos from "./pages/Repos.svelte";
	import Settings from "./pages/Settings.svelte";

	export let ipcRenderer;

	let pageName = "repos";
	const pageMap = {
		repos: Repos,
		settings: Settings,
	};
</script>

<style>
	main {
		max-width: 100%;
		width: 100%;
		height: 100%;
		display: grid;
		grid-template: var(--size-7) calc(100% - var(--size-7)) / 100%;
	}
</style>

<main>
	<AppBar {ipcRenderer} bind:pageName />
	<svelte:component this={pageMap[pageName]} {ipcRenderer} />
	<Toaster />
</main>

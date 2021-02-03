<script>
	//TODO might be nice to split the root element as its own component
	// ... given all the tweaks here to accomodate both normal nodes and root behavior
	import { focusedGitHubPath, focusedPathisLeaf } from "../../store";
	import { fly } from "svelte/transition";
	import Leaf from "./Leaf.svelte";
	import ToggleExpandButton from "./ToggleExpandButton.svelte";

	export let expanded = false;
	export let files = [];
	export let depthLimit;
	export let path;

	//TODO no seriously, accomodating root behavior is starting to be irritating
	expanded = path.split("/").length == 1 ? true : false;

	let loading = false;
	let loaded = false;
	let focused = false;

	$: name = path.split("/").pop() || "missing name";
	$: depth = path.split("/").length;

	const isRootPath = path => path.split("/").length == 1;

	const watcherFocusedGitHubPath = focusedGitHubPath.subscribe(value => {
		if (value === path) {
			focused = true;
		} else {
			focused = false;
		}
	});

	async function toggle() {
		if (!loaded) {
			loading = true;

			//TODO I shouldn't have to do something that ugly
			//but https://www.youtube.com/watch?v=SETnK2ny1R0&ab_channel=EspenSandeLarsen-Topic
			//but ... but ... https://github.com/dwmkerr/hacker-laws#the-broken-windows-theory
			const fetchArgs = path.split("/");
			const content = await (
				await fetch(
					`https://api.github.com/repos/${fetchArgs
						.slice(0, 2)
						.join("/")}/contents/${fetchArgs.slice(2).join("/")}`
				)
			).json();

			content.forEach(el => {
				if (el.type == "dir" && !el.name.toLowerCase().includes("readme_resources"))
					files.push({ path: path + "/" + el.path.split("/").pop() });
			});

			expanded = !expanded;
			loaded = true;
			loading = false;
		} else if (!loading) {
			expanded = !expanded;
		}
	}

	function selectReadme() {
		focusedGitHubPath.update(() => path);
		focusedPathisLeaf.update(() => false);
	}
</script>

<style>
	span {
		padding: 0.5em;
		background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
		display: flex;
	}

	span:hover {
		background-color: var(--focus-1);
		border-color: var(--focus-1);
	}

	.expanded {
		background-image: url(tutorial/icons/folder-open.svg);
	}

	.focused {
		background-color: var(--focus-2) !important;
		border-color: var(--focus-2) !important;
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		border: 0.2em 0;
		border-block-color: white;
	}
</style>

<span class:expanded class:focused on:click={selectReadme}>
	<ToggleExpandButton open={expanded} onclick={toggle} />
	<div>{name}</div>
</span>

{#if expanded}
	<ul transition:fly|local={{ y: -20 }}>
		{#each files as file}
			<li>
				{#if depth < depthLimit || isRootPath(path)}
					<svelte:self {depthLimit} {...file} />
				{:else}
					<Leaf {...file} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

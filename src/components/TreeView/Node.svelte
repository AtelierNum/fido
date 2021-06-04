<script>
	//TODO might be nice to split the root element as its own component
	// ... given all the tweaks here to accomodate both normal nodes and root behavior

	/*typical data object for a Node
    {
        path:string
        expanded:boolean
        children:Array of Nodes || null
        metadata:FidoMetadata
    }
    */

	import { focusedGitHubPath, focusedPathisLeaf } from "../../store";
	import { fly } from "svelte/transition";
	import Leaf from "./Leaf.svelte";
	import ToggleExpandButton from "./ToggleExpandButton.svelte";

	export let expanded = false;
	export let files = [];
	export let depthLimit;
	export let path;
	export let onToggle = () => {};

	//TODO no seriously, accomodating root behavior is starting to be irritating
	expanded = path.split("/").length == 1 ? true : false;

	let loading = false;
	let loaded = false;
	let focused = false;
	let selected = false;

	$: name = path.split("/").pop() || "missing name";
	$: depth = path.split("/").length;

	const isRootPath = path => path.split("/").length == 1;

	const watcherFocusedGitHubPath = focusedGitHubPath.subscribe(value => {
		focused = typeof value == "string" && value.includes(path);
		selected = path === value;
	});

	async function toggle() {
		if (loaded) {
			expanded = !expanded;
		} else {
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
				if (
					el.type == "dir" &&
					!el.name.toLowerCase().includes("readme_resources") &&
					!el.name.match(/^_/i)
				)
					files.push({ path: path + "/" + el.path.split("/").pop() });
			});

			expanded = !expanded;
			loaded = true;
			loading = false;
		}
	}

	function selectReadme() {
		focusedGitHubPath.update(() => path);
		focusedPathisLeaf.update(() => false);
	}
</script>

<style>
	span {
		padding: 0.5em 0.5em 0.5em 0;
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
		color: var(--color-text-bold);
		font-weight: bold;
	}

	.selected {
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

<span
	class:expanded
	class:focused
	class:selected
	on:click={() => {
		selectReadme();
		toggle();
		onToggle();
	}}>
	<ToggleExpandButton open={expanded} />
	<div>{name}</div>
</span>

{#if expanded}
	<ul transition:fly|local={{ y: -20 }}>
		{#each files as file}
			<li>
				{#if depth < depthLimit || isRootPath(path)}
					<svelte:self {onToggle} {depthLimit} {...file} />
				{:else}
					<Leaf {...file} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

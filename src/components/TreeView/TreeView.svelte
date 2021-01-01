<script>
	//TODO might be nice to split the root element as its own component
	// ... given all the tweaks here to accomodate both normal nodes and root behavior
	import { focusedGitHubPath, focusedPathisLeaf } from "../../store";
	import Leaf from './Leaf.svelte';

	export let expanded = false;
	export let files = [];
	export let depthLimit;
	export let path;

	//TODO no seriously, accomodating root behavior is starting to be irritating
	expanded = path.split("/").length == 1 ? true : false;

	let loading = false;
	let loaded = false;

	$: name = path.split("/").pop() || "missing name";
	$: depth = path.split("/").length;

	const isRootPath = path => path.split("/").length == 1;

	async function toggle() {
		//TODO split the folding/unfolding and focus/unfocus logics
		focusedGitHubPath.update(() => path);
		focusedPathisLeaf.update(() => false);

		if(!loaded){
			loading = true;

			//TODO I shouldn't have to do something that ugly
			//but https://www.youtube.com/watch?v=SETnK2ny1R0&ab_channel=EspenSandeLarsen-Topic
			//but ... but ... https://github.com/dwmkerr/hacker-laws#the-broken-windows-theory
			const fetchArgs = path.split("/");
			const content = await (await fetch(`https://api.github.com/repos/${fetchArgs.slice(0,2).join("/")}/contents/${fetchArgs.slice(2).join("/")}`)).json();

			content.forEach(el => {
				if (el.type == "dir") files.push({path: path+"/"+el.path.split("/").pop()})
			})
			
			expanded = !expanded;
			loaded = true;
			loading = false;
		}else if(!loading){
			expanded = !expanded;
		}
	}
</script>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
	}

	.expanded {
		background-image: url(tutorial/icons/folder-open.svg);
	}

	ul {
		padding: 0.2em 0 0 0.5em;
		margin: 0 0 0 0.5em;
		list-style: none;
		border-left: 1px solid #eee;
	}

	li {
		padding: 0.2em 0;
	}
</style>

<span class:expanded on:click={toggle}>{name}</span>

{#if expanded}
	<ul>
		{#each files as file}
			<li>
				{#if (depth < depthLimit) || isRootPath(path)}
					<svelte:self {depthLimit} {...file}/>
				{:else}
					<Leaf {...file}/>
				{/if}
			</li>
		{/each}
	</ul>
{/if}
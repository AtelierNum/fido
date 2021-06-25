<script>
	/*typical data object for a Node
    {
        path:string
        expanded:boolean
        children:Object of Nodes || null
        metadata:FidoMetadata
    }
    */

	import { focusedGitHubPath, focusedPathisLeaf } from "../../store";
	import { fly } from "svelte/transition";
	import Leaf from "../TreeView/Leaf.svelte";
	import ToggleExpandButton from "../TreeView/ToggleExpandButton.svelte";

	export let tree;
	export let currentNode;

	let loading = false;
	let loaded = false;
	let focused = false;
	let selected = false;

	$: name = currentNode.path.split("/").pop() || "missing name";

	const isRootPath = path => path.split("/").length == 1;

	const watcherFocusedGitHubPath = focusedGitHubPath.subscribe(value => {
		focused = typeof value == "string" && value.includes(currentNode.path);
		selected = currentNode.path === value;
	});

	async function toggle() {
		if (loaded) {
			currentNode.expanded = !currentNode.expanded;
		} else {
			loading = true;

			//TODO I shouldn't have to do something that ugly
			//but https://www.youtube.com/watch?v=SETnK2ny1R0&ab_channel=EspenSandeLarsen-Topic
			//but ... but ... https://github.com/dwmkerr/hacker-laws#the-broken-windows-theory
			const fetchArgs = currentNode.path.split("/");
			const content = await (
				await fetch(
					`https://api.github.com/repos/${fetchArgs
						.slice(0, 2)
						.join("/")}/contents/${fetchArgs.slice(2).join("/")}`
				)
			).json();

			if (content.find(el => el.name == ".fido.json")) {
				currentNode.metadata = await (
					await fetch(
						`https://raw.githubusercontent.com/${fetchArgs
							.slice(0, 2)
							.join("/")}/main/${fetchArgs.slice(2).join("/")}/.fido.json`
					)
				).json();
			}

			//TODO attempt to fetch the metadata for all dirs
			//probably try to use Promise.allSettled
			const metadataPromises = content.map(el => {
				if (el.type == "dir") {
					return fetch(
						`https://raw.githubusercontent.com/${fetchArgs
							.slice(0, 2)
							.join("/")}/main/${fetchArgs.slice(2).join("/")}/${el.name}/.fido.json`
					).then(res => res.json());
				}
			});

			(await Promise.allSettled(metadataPromises)).forEach(p =>
				console.dir((p.status = "fulfilled" ? p.value : "rejected"))
			);

			currentNode.children = {};
			content.forEach(el => {
				if (
					el.type == "dir" &&
					!el.name.toLowerCase().includes("readme_resources") &&
					!el.name.match(/^_/i)
				) {
					const elementPath = currentNode.path + "/" + el.path.split("/").pop();
					currentNode.children[elementPath] = {
						path: elementPath,
						expanded: false,
						children: null,
						metadata: null,
					};
				}
			});

			currentNode.expanded = !currentNode.expanded;
			loaded = true;
			loading = false;
			console.dir(tree);
		}
	}

	function selectReadme() {
		focusedGitHubPath.update(() => currentNode.path);
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
	class:expanded={currentNode.expanded}
	class:focused
	class:selected
	on:click={() => {
		selectReadme();
		toggle();
	}}>
	<ToggleExpandButton open={currentNode.expanded} />
	<div>{name}</div>
</span>

{#if currentNode.expanded && currentNode.children}
	<ul transition:fly|local={{ y: -20 }}>
		{#each Object.keys(currentNode.children) as childKey}
			<li>
				{#if currentNode.metadata}
					<Leaf {...currentNode} />
				{:else}
					<svelte:self currentNode={currentNode.children[childKey]} {tree} />
				{/if}
			</li>
		{/each}
	</ul>
{/if}

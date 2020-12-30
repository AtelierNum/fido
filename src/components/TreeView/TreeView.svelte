<script>
	import Leaf from './Leaf.svelte';

	export let expanded = false;
	export let files;
	export let depthLimit;
	export let path;

	$: name = path.split("/").pop() || "missing name";
	let fetched = false;

	$: depth = path.split("/").length;

	const isRootPath = path => path.split("/").length == 1;

	function toggle() {
		if(!fetched){
			fetched = true;

			//TODO : fetch files by path
			if(name == "boilerplates"){
				files = [
					{
						path:path+"/BP1",
						files:[
							{
								path:"boilerplates/BP1/LeafTest",
								files:[
									{
										path:"boilerplates/BP1/LeafTest/UselessFile"
									}
								]
							}
						]
					},
					{path:path+"/BP2"},
					{path:path+"/BP3"},
				]
			}
		}
		expanded = !expanded;
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
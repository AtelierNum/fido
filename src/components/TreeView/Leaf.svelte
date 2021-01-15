<script>
	import { focusedGitHubPath, focusedPathisLeaf } from "../../store";

	export let path;

	$: name = path.split("/").pop();

	let focused = false;

	const watcherFocusedGitHubPath = focusedGitHubPath.subscribe(value => {
		if(value === path){
			focused = true;
		}else{
			focused = false;
		}
	});
</script>

<style>
	span {
		padding: .5em .5em .5em 2em;
		background: url(tutorial/icons/folder.svg) 0 0.1em no-repeat;
		background-size: 1em 1em;
		font-weight: bold;
		cursor: pointer;
		display: flex;
	}

	span:hover{
		background-color: deepskyblue;
		border-color: deepskyblue;
	}

	.focused {
		background-color: cornflowerblue !important;
		border-color: cornflowerblue !important;
	}
</style>

<span
	class:focused
	on:click={() => {
		focusedGitHubPath.update(() => path);
		focusedPathisLeaf.update(() => true);
	}}
	style="background-image: url(tutorial/icons/{'type'}.svg)">{name}</span>

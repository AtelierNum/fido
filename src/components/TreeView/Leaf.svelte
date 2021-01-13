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
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}

	.focused {
		background-color: lightsalmon;
	}
</style>

<span
	class:focused
	on:click={() => {
		focusedGitHubPath.update(() => path);
		focusedPathisLeaf.update(() => true);
	}}
	style="background-image: url(tutorial/icons/{'type'}.svg)">{name}</span>

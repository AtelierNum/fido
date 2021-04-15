<script>
	import { focusedGitHubPath, focusedPathisLeaf } from "../../store";

	export let path;

	$: name = path.split("/").pop();

	let focused = false;

	const watcherFocusedGitHubPath = focusedGitHubPath.subscribe(value => {
		if (value === path) {
			focused = true;
		} else {
			focused = false;
		}
	});
</script>

<style>
	span {
		padding: 0.5em 0.5em 0.5em 0.5em;
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

	.focused {
		background-color: var(--focus-2) !important;
		border-color: var(--focus-2) !important;
		color: var(--color-text-bold);
	}
</style>

<span
	class:focused
	on:click={() => {
		focusedGitHubPath.update(() => path);
		focusedPathisLeaf.update(() => true);
	}}
	style="background-image: url(tutorial/icons/{'type'}.svg)">{name}</span
>

<script>
	import { downloadTarget } from "../../store";

	export let path;

	$: name = path.split("/").pop();
</script>

<style>
	span {
		padding: 0 0 0 1.5em;
		background: 0 0.1em no-repeat;
		background-size: 1em 1em;
	}
</style>

<span on:click={() => {downloadTarget.update(() => path)}} style="background-image: url(tutorial/icons/{"type"}.svg)">{name}</span>
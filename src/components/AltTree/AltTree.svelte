<script>
	import AltNode from "./AltNode.svelte";

	export let tree = {};

	function appendNode() {}
</script>

<AltNode onToggle={appendNode} {tree} currentNode={tree} />

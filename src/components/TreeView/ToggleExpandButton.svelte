<script>
   export let open;
   export let onclick;
</script>

<div class:open on:click={onclick}>
   <div>&#x25b6</div>
</div>

<style>
.open{
   transform: rotate(90deg);
}
</style>
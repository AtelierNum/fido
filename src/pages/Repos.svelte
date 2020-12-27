<script>
    export let pageName;

    const currentDate = new Date();
</script>
<main>
    <h1>Repos</h1>
    <button on:click={() => {pageName = "index"}}>go back</button>
    {currentDate}
</main>
<style>
    h1 {
        text-transform: uppercase;
        font-size: 3em;
        font-weight: 100;
    }
</style>
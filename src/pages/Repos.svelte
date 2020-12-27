<script>
    import { onMount } from "svelte";
    import marked from "marked";

    export let pageName;

    let readmeContent = "";
    let readmes = {};

    function changeReadme(repoName){
        if(readmes[repoName]){
            readmeContent = readmes[repoName];
        }else{
            fetch(`https://raw.githubusercontent.com/AtelierNum/${repoName}/main/README.md`).then(response => response.text()).then(data => {
                readmeContent = data
                readmes[repoName] = data
            })
        }
    }

    onMount(() => {
        changeReadme("boilerplates");
    }) 
</script>
<section>
    <ul>
        <li>boilerplates</li>
        <li>unity toolkit</li>
    </ul>
    <!-- TODO : I still need to make the link absolute and open externaly though, same for the images-->
    <div id="readme">{@html marked(readmeContent)}</div>
    <div>{readmeContent}</div>
</section>
<style>
    section {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template: 1fr / minmax(200px,1fr) 2fr;
    }

    ul {
        list-style-type: none;
    }

    #readme {
        justify-self: center;
    }
</style>
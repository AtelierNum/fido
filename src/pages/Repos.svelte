<script>
    import marked from "marked";

    export let pageName;

    let readmeContent = "";
    let readmes = {};

    function changeReadme(repoName){
        if(readmes[repoName]){
            readmeContent = readmes[repoName];
        }else{
            // TODO : make it easier on the eyes
            fetch(`https://raw.githubusercontent.com/AtelierNum/${repoName}/main/README.md`).then(response => response.text()).then(data => {
                data = data.replaceAll(/!\[\]\(.+\)/gi, match => {
                    return `<img src="https://raw.githubusercontent.com/AtelierNum/${repoName}/main/${match.slice(4,-1)}">`;
                })

                data = data.replaceAll(/\[.+\]\(.+\)/gi, mdLink => {
                    return mdLink.match(/\[.+\]/i)[0].slice(1,-1);
                })

                readmeContent = data;
                readmes[repoName] = data;
            })
        }
    }
</script>
<section>
    <ul>
        <li on:click={() => {changeReadme("boilerplates")}}>boilerplates</li>
        <li on:click={() => {changeReadme("unity_toolkit")}}>unity toolkit</li>
    </ul>
    <div id="readme" on:click|preventDefault>{@html marked(readmeContent)}</div>
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

    /* TODO maybe catch the link when the event bubble up then prevent_default and open the link in default browser wtih {shell} = require("electron") */
    :global(#readme a){
        color: inherit;
        text-decoration: none;
        pointer-events: none;
    }
</style>
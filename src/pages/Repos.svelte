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
    <!-- TODO : I still need to make the link absolute and open externaly though, same for the images-->
    <!-- nah nevermind for the links, they are a table of content anyway so we'll browse these while browsing the templates anyway -->
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
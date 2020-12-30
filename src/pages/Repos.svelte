<script>
    //NOTE : basic idea => if the folder has a readme you can download it unless it's the top most folder (i.e one from the enum/whitelist)
    import marked from "marked";
    import TreeView from "../components/TreeView/TreeView.svelte"
    export let pageName;

    let readmeContent = "";
    let readmes = {};

    function changeReadme(repoName){
        // TODO : reactivate once TreeView is done
        // if(readmes[repoName]){
        //     readmeContent = readmes[repoName];
        // }else{
        //     // TODO : make it easier on the eyes
        //     fetch(`https://raw.githubusercontent.com/AtelierNum/${repoName}/main/README.md`).then(response => response.text()).then(data => {
        //         data = data.replaceAll(/!\[\]\(.+\)/gi, match => {
        //             return `<img src="https://raw.githubusercontent.com/AtelierNum/${repoName}/main/${match.slice(4,-1)}">`;
        //         })

        //         data = data.replaceAll(/\[.+\]\(.+\)/gi, mdLink => {
        //             return mdLink.match(/\[.+\]/i)[0].slice(1,-1);
        //         })

        //         readmeContent = data;
        //         readmes[repoName] = data;
        //     })
        // }
    }
</script>
<section>
    <div>
        <!-- TODO replace these hardecoded top level folder with an array generated from a (enum||whitelist).json -->
        <TreeView path="AtelierNum" files={[
            {
                path:'AtelierNum/boilerplates',
                depthLimit: '3',//AtelierNum/boilerplates/unity/hello_AR_Foundation <=> {1,2,3,leaf}
            },
            {
                path:'AtelierNum/unity_toolkit',
                depthLimit: '3',//unity_toolkit/classic_modules/hello_world
            }
        ]}/>
    </div>
    <div id="readme" on:click|preventDefault>{@html marked(readmeContent)}</div>
    <div>{readmeContent}</div>
</section>
<style>
    section {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template: 100% / 200px 1fr;
    }

    ul {
        list-style-type: none;
    }

    #readme {
        height: 100%;
        justify-self: center;
        align-self: stretch;
        overflow-y: auto;
    }

    /* TODO maybe catch the navigation event when bubbling up then prevent_default and open the link in default browser wtih {shell} = require("electron") */
    :global(#readme a){
        color: inherit;
        text-decoration: none;
        pointer-events: none;
    }

    :global(#readme img){
        max-width: 100%;
    }
</style>
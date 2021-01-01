<script>
   //https://www.youtube.com/watch?v=C2Yx90pytqs&ab_channel=Orpheus
   import { fly } from "svelte/transition"
   import { toastMsg } from "../store";

   export let open = false;

   let msg = "";

   const watcherToastMsg = toastMsg.subscribe(value => {
      msg = value;
      if(msg.trim() != ""){
         open = true;
      }
   })
</script>

{#if open}
   <div id="container" transition:fly="{{y:20}}">
      <div class="closeButton" on:click={() => {open = false}}>x</div>
      {msg}
   </div>
{/if}

<style>
   .closeButton{
      position:absolute;
      top: 3px;
      right: 5px;
   }

   #container{
      box-sizing: border-box;
      min-height: 50px;
      background-color: lightblue;
      padding: 1em;
   }
</style>
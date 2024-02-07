<script>
  import { assignments } from "../stores/stores";
  export let assignment;
</script>

<select bind:value={assignment} >
  {#each $assignments as a, i}
    <option value={a}>{i+1}. {a.title}</option>
  {/each}
</select>
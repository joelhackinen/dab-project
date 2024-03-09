<script>
  import { assignments } from "../stores/stores";
  export let assignment;
  
  let nextAssignment;

  $: nextAssignment = $assignments.reduce((prev, curr) => curr.assignment_order > prev && curr.completed ? prev + 1 : prev, 0) + 1;
</script>


<div class="flex flex-wrap gap-x-2">
  <label for="assignment-selection">Pick an assignment:</label>
  <select
    id="assignment-selection"
    class="rounded border border-black"
    bind:value={assignment}
  >
    {#each $assignments as a, i}
      <option value={a} disabled={a.assignment_order > nextAssignment}>
        {i+1}. {a.title}{`${a.completed ? " (completed)" : ""}`}
      </option>
    {/each}
  </select>
</div>
<script>
  import { markAssignmentCompleted, userUuid } from "../stores/stores";
  import { onMount, onDestroy } from "svelte";
  import GradingButton from "./GradingButton.svelte";
  import TextArea from "./TextArea.svelte";
  import AssignmentSelection from "./AssignmentSelection.svelte";
  import Points from "./Points.svelte";

  let code = "";
  let assignment;
  let source;

  onMount(() => {
    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.addEventListener("result", (event) => {
      const obj = JSON.parse(event.data);
      if (obj.correct) {
        alert("correct!");
        markAssignmentCompleted(obj.programming_assignment_id);
        return;
      }
      alert("incorrect!");
    });

    source.addEventListener("init", (event) => {
      console.log(event.data);
    });

    source.onerror = (error) => {
      console.error(error);
    };
  });

  onDestroy(() => {
    source.close();
  });
</script>

<div class="flex flex-col gap-2 items-start">
  <div class="flex justify-between w-full items-center">
    <AssignmentSelection bind:assignment />
    <Points />
  </div>

  {#if assignment}
    <p>{assignment.handout}</p>
  {/if}

  <TextArea bind:code />
  <GradingButton code={code} assignmentNumber={assignment?.assignment_order} />
</div>
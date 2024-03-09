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
  let showFeedback = false;
  let feedback = "";

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
      showFeedback = true;
      feedback = obj.grader_feedback;
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

  const hideFeedback = () => {
    console.log("error closed")
    showFeedback = false;
    feedback = "";
  };

  const submitCode = async () => {
    const data = {
      assignmentNumber: assignment?.assignment_order,
      code,
    };

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": $userUuid,
      },
      body: JSON.stringify(data),
    });

    console.log(`submission ${response.status === 200 ? "accepted": "rejected"}`);
  };
</script>

<div class="flex flex-col gap-2 items-start">
  <div class="flex justify-between w-full items-center">
    <AssignmentSelection bind:assignment />
    <Points />
  </div>

  {#if assignment}
    <p>{assignment.handout}</p>
  {/if}

  {#if showFeedback}
    <code class="relative bg-slate-200 text-red-500">
      <button
        class="absolute -top-2 -right-2 z-10 rounded-full bg-white"
        on:click={hideFeedback}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      {feedback}
    </code>
  {/if}

  <TextArea bind:code />
  <GradingButton {submitCode}>
    Submit
  </GradingButton>
</div>
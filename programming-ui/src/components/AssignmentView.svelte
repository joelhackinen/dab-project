<script>
  import { setAssignmentsStore, userUuid } from "../stores/stores";
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
  let pending = false;

  $: if (assignment) {
    hideFeedback();
  }

  onMount(() => {
    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.addEventListener("result", async (event) => {
      pending = false;
      const obj = JSON.parse(event.data);
      if (obj.correct) {
        alert("correct!");
        code = "";
        await setAssignmentsStore();
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
    showFeedback = false;
    feedback = "";
  };

  const submitCode = async () => {
    if (!assignment) {
      alert("No assignment chosen")
      return;
    }
    const data = {
      assignmentNumber: assignment.assignment_order,
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
    hideFeedback();

    if (response.status !== 200) {
      alert("submission rejected; you might have pending submissions");
      return;
    }
    pending = true;
  };
</script>

<div class="flex flex-col gap-2">
  <div class="self-center w-full max-w-screen-md mb-16">
    <Points />
  </div>
  <AssignmentSelection bind:assignment />


  {#if assignment}
    <h5 class="font-bold mt-4">Assignment:</h5>
    <p id="assignment-handout">{assignment.handout}</p>
  {/if}

  {#if showFeedback}
    <code id="feedback-box" class="relative bg-slate-200 text-red-500 p-4 rounded-xl">
      <button
        class="absolute -top-2 -right-2 z-10 rounded-full bg-white hover:bg-red-500 hover:text-white"
        on:click={hideFeedback}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </button>
      {feedback}
    </code>
  {/if}

  <TextArea bind:code disabled={pending} />
  <GradingButton {submitCode} disabled={pending}>
    Submit
  </GradingButton>
</div>
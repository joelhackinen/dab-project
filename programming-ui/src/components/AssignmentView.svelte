<script>
  import { userUuid } from "../stores/stores";
  import { onMount, onDestroy } from "svelte";
  import GradingButton from "./GradingButton.svelte";
  import TextArea from "./TextArea.svelte";
  import AssignmentSelection from "./AssignmentSelection.svelte";

  let code = "";
  let message = "";
  let assignment;
  let source;

  onMount(() => {
    source = new EventSource(`/sse/?user=${$userUuid}`);

    source.onmessage = (evt) => {
      console.log(evt.data);
      message = evt.data;
    };

    source.onerror = (error) => {
      console.log(error);
    };
  });

  onDestroy(() => {
    source.close();
  });
</script>

<h5>{message}</h5>

<AssignmentSelection bind:assignment />
<TextArea bind:code />
<GradingButton code={code} assignmentNumber={assignment?.assignment_order} />
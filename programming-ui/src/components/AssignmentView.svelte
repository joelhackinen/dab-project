<script>
  import { onMount } from "svelte";

  let message = "";
  onMount(() => {

    const source = new EventSource("/api/sse");

    source.onmessage = (evt) => {
      console.log(evt.data);
      message = evt.data;
    };
  });
</script>

<h5>{message}</h5>
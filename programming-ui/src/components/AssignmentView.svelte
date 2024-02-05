<script>
  import { userUuid } from "../stores/stores";
  import { onMount, onDestroy } from "svelte";

  let message = "";
  onMount(() => {
    const source = new EventSource(`/sse/?user=${$userUuid}`);

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

  const pingSseServer = async () => {
    await fetch("/sse/ping");
  };
</script>

<h5>{message}</h5>
<button
  on:click={pingSseServer}
>
  PINsaddsad
</button>
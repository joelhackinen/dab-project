<script>
  import GradingButton from "./GradingButton.svelte";
  import TextArea from "./TextArea.svelte";

  let code = "";
</script>

<TextArea bind:code />
<GradingButton code={code} />
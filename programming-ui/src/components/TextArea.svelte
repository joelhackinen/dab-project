<script>
  import { tick } from "svelte";

  export let code;
  export let disabled;

  const handleKeydown = async (event) => {
    if (event.key !== "Tab") return;

    event.preventDefault();
    const { selectionStart, selectionEnd, value } = event.target;
    code = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
    
    await tick();
    
    event.target.selectionStart = selectionStart + 1;
    event.target.selectionEnd = selectionStart + 1;
  };
</script>

<textarea
  id="code-block"
  class="w-full h-52 focus:shadow-xl rounded-md border border-black font-mono bg-gray-50 disabled:bg-gray-200 outline-none"
  bind:value={code}
  on:keydown={handleKeydown}
  disabled={disabled}
/>
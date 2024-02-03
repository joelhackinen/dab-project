<script>
  import { tick } from "svelte";

	export let code;

	const handleKeydown = async (event) => {
		if (event.key !== 'Tab') return;

		event.preventDefault();
		const { selectionStart, selectionEnd, value } = event.target;
		const updatedText = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);
		code = updatedText;

    await tick();

		event.target.selectionStart = selectionStart + 1;
    event.target.selectionEnd = selectionStart + 1;
	}
</script>

<textarea
  class="w-full h-52 shadow-lg border border-black rounded-md font-mono"
  bind:value={code}
  on:keydown={handleKeydown}
/>
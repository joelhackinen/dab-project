<script>
	let text = "";

	async function handleKeydown(event) {
		if (event.key !== 'Tab') return;

		event.preventDefault();

    const { selectionStart, selectionEnd, value } = this;

    const updatedText = value.slice(0, selectionStart) + '\t' + value.slice(selectionEnd);

    text = updatedText;
    this.selectionStart = this.selectionEnd = selectionStart + 1;
	}
</script>

<textarea
  class="w-full h-52 shadow-lg border border-black rounded-md font-mono"
  bind:value={text}
  on:keydown={handleKeydown}
/>
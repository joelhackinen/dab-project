<script>
  export let submitCode;
  export let disabled;
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded disabled:bg-gray-500"
  disabled={disabled}
  on:click={submitCode}
>
  <slot />
</button>

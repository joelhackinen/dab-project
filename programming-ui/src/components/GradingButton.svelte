<script>
  export let submitCode;
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded disabled:bg-gray-500"
  on:click={submitCode}
>
  <slot />
</button>

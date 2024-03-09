<script>
  import { assignments } from "../stores/stores";

  let maxPoints = 0;
  let points = 0;

  $: {
    maxPoints = $assignments.length * 100;
    points = $assignments.filter(a => a.completed).length * 100;
  }
</script>

<div class="flex flex-col">
  <span class="font-semibold mx-auto">{points} / {maxPoints}</span>
  <div class="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
    <div class="bg-blue-600 h-2.5 rounded-full" style={`width: ${(points/maxPoints)*100}%`} />
  </div>
</div>

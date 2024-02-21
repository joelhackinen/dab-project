<script>
  import { assignments } from "../stores/stores";

  let maxPoints = 0;
  let points = 0;

  $: {
    maxPoints = $assignments.length * 100;
    points = $assignments.filter(a => a.completed).length * 100;
  }
</script>


<div class="flex no-wrap gap-x-2">
  <span>Points:</span>
  <span
    id="points"
    class={`font-bold ${points <= maxPoints * (1/3) ? "text-red-500" : (points <= maxPoints * (2/3) ? "text-yellow-400" : "text-green-500")}`}
  >
    {points} / {maxPoints}
  </span>
</div>
<script>
  import { userUuid } from "../stores/stores.js";

  export let code;
  export let assignmentNumber;
  
  const submitCode = async () => {
    const data = {
      assignmentNumber,
      code,
    };

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": $userUuid,
      },
      body: JSON.stringify(data),
    });

    console.log(`submission, ${response.status === 200 ? "accepted": "rejected"}`);
  };
</script>

<button
  class="bg-blue-500 hover:bg-blue-700 text-white font-bold p-4 rounded disabled:bg-gray-500"
  on:click={submitCode}
  disabled={!assignmentNumber}
>
  Submit
</button>

<script>
  import { onMount } from 'svelte';
  let players = $state([]);
  let name = $state('');
  let rating = $state('');
  async function loadPlayers() {
    const res = await fetch('/api/players');
    players = await res.json();
  }
  async function addPlayer() {
    await fetch('/api/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rating: Number(rating) })
    });
    name = '';
    rating = '';
    loadPlayers();
  }
  onMount(() => {
    loadPlayers();
  });
  async function deletePlayer(id) {
    await fetch('/api/players', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    loadPlayers();
  }
</script>

<div class="max-w-2xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-slate-800 mb-6">Players</h1>
  <div class="flex gap-2 mb-6">
    <input bind:value={name} placeholder="Name" class="border border-slate-300 rounded px-3 py-2 flex-1" />
    <input bind:value={rating} placeholder="Rating" class="border border-slate-300 rounded px-3 py-2 w-28" />
    <button onclick={addPlayer} class="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">Add Player</button>
  </div>
  <ul class="space-y-2">
    {#each players as player}
      <li class="flex justify-between items-center bg-white border border-slate-200 rounded px-4 py-3 shadow-sm">
        <span>{player.name} <span class="text-slate-500">— Rating: {player.rating}</span></span>
        <button onclick={() => deletePlayer(player.id)} class="text-red-600 hover:text-red-800 text-sm">Delete</button>
      </li>
    {/each}
  </ul>
</div>

<script>
  import { onMount } from 'svelte';

let tournaments = $state([]);
let name = $state('');
let location = $state('');
let start_date = $state('');
let end_date = $state('');
let editingId = $state(null);

  // Load tournaments (GET)
  async function loadTournaments() {
    const res = await fetch('/api/tournaments');
    tournaments = await res.json();
  }

  // Add tournament (POST)
  async function saveTournament() {
  if (editingId) {
    await fetch('/api/tournaments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editingId, name, location, start_date, end_date })
    });
    editingId = null;
  } else {
    await fetch('/api/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location, start_date, end_date })
    });
  }
  name = '';
  location = '';
  start_date = '';
  end_date = '';
  loadTournaments();
}
  // Delete tournament
  async function deleteTournament(id) {
    await fetch('/api/tournaments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });

    loadTournaments();
  }
  function startEdit(tournament) {
  editingId = tournament.id;
  name = tournament.name;
  location = tournament.location;
  start_date = tournament.start_date;
  end_date = tournament.end_date;
}
  onMount(() => {
    loadTournaments();
  });
</script>

<div class="max-w-2xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-slate-800 mb-6">Tournaments</h1>

  <div class="flex flex-wrap gap-2 mb-6">
    <input bind:value={name} placeholder="Tournament Name" class="border border-slate-300 rounded px-3 py-2 flex-1 min-w-[160px]" />
    <input bind:value={location} placeholder="Location" class="border border-slate-300 rounded px-3 py-2 flex-1 min-w-[120px]" />
    <input type="date" bind:value={start_date} class="border border-slate-300 rounded px-3 py-2" />
    <input type="date" bind:value={end_date} class="border border-slate-300 rounded px-3 py-2" />
<button onclick={saveTournament} class="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">{editingId ? 'Update Tournament' : 'Add Tournament'}</button>  </div>

  <ul class="space-y-2">
    {#each tournaments as tournament}
      <li class="flex justify-between items-center bg-white border border-slate-200 rounded px-4 py-3 shadow-sm">
        <a href={`/tournaments/${tournament.id}`} class="text-slate-800 hover:text-amber-600 font-medium">
          {tournament.name}
        </a>
        <span class="text-slate-500 text-sm">{tournament.location} · {tournament.start_date} to {tournament.end_date}</span>
<div class="flex gap-4">
  <button onclick={() => startEdit(tournament)} class="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
  <button onclick={() => deleteTournament(tournament.id)} class="text-red-600 hover:text-red-800 text-sm">Delete</button>
</div>

      </li>
    {/each}
  </ul>
</div>
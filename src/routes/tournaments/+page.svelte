<script>
  import { onMount } from 'svelte';

let tournaments = $state([]);
let name = $state('');
let location = $state('');
let start_date = $state('');
let end_date = $state('');

  // Load tournaments (GET)
  async function loadTournaments() {
    const res = await fetch('/api/tournaments');
    tournaments = await res.json();
  }

  // Add tournament (POST)
  async function addTournament() {
    await fetch('/api/tournaments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        location,
        start_date,
        end_date
      })
    });

    // Clear form
    name = '';
    location = '';
    start_date = '';
    end_date = '';

    // Reload list
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

  onMount(() => {
    loadTournaments();
  });
</script>

<h1>Tournaments</h1>

<input bind:value={name} placeholder="Tournament Name" />
<input bind:value={location} placeholder="Location" />
<input type="date" bind:value={start_date} />
<input type="date" bind:value={end_date} />

<button onclick={addTournament}>
  Add Tournament
</button>

<ul>
  {#each tournaments as tournament}
<li>
  <a href={`/tournaments/${tournament.id}`}><strong>{tournament.name}</strong></a> -
  {tournament.location} -
  {tournament.start_date} -
  {tournament.end_date}
  <button onclick={() => deleteTournament(tournament.id)}>
    Delete
  </button>
</li>
  {/each}
</ul>
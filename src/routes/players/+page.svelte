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

<h1>Players</h1>
<input bind:value={name} placeholder="Name" />
<input bind:value={rating} placeholder="Rating" />
<button onclick={addPlayer}>Add Player</button>
<ul>
  {#each players as player}
    <li>
      {player.name} - Rating: {player.rating}
      <button onclick={() => deletePlayer(player.id)}>Delete</button>
    </li>
  {/each}
</ul>
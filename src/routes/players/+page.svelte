<script>
  import { onMount } from 'svelte';

  let players = $state([]);

  async function loadPlayers() {
    const res = await fetch('/api/players');
    players = await res.json();
  }

  onMount(() => {
    loadPlayers();
  });
</script>

<h1>Players</h1>

<ul>
  {#each players as player}
    <li>{player.name} - Rating: {player.rating}</li>
  {/each}
</ul>
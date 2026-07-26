<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let tournamentId = page.params.id;
  let tournamentPlayers = $state([]);

  async function loadTournamentPlayers() {
    const res = await fetch(`/api/tournament-players?tournament_id=${tournamentId}`);
    tournamentPlayers = await res.json();
  }

  onMount(() => {
    loadTournamentPlayers();
  });
</script>

<h1>Tournament #{tournamentId}</h1>

<h2>Players in this tournament</h2>
<ul>
  {#each tournamentPlayers as player}
    <li>{player.name} - Rating: {player.rating}</li>
  {/each}
</ul>
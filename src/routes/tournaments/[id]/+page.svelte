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
  let matches = $state([]);

  async function startRound() {
    await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournament_id: tournamentId })
    });
    loadMatches();
  }

  async function loadMatches() {
    const res = await fetch(`/api/matches?tournament_id=${tournamentId}`);
    matches = await res.json();
  }
</script>
<button onclick={startRound}>Start Round</button>

<h2>Matches</h2>
<ul>
  {#each matches as match}
    <li>Player {match.player1_id} vs Player {match.player2_id} — Winner: Player {match.winner_id}</li>
  {/each}
</ul>

<h1>Tournament #{tournamentId}</h1>

<h2>Players in this tournament</h2>
<ul>
  {#each tournamentPlayers as player}
    <li>{player.name} - Rating: {player.rating}</li>
  {/each}
</ul>
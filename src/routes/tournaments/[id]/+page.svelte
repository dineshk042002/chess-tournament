<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let tournamentId = page.params.id;

  let tournamentPlayers = $state([]);
  let matches = $state([]);

  // Load players
  async function loadTournamentPlayers() {
    const res = await fetch(
      `/api/tournament-players?tournament_id=${tournamentId}`
    );
    tournamentPlayers = await res.json();
  }

  // Load matches
  async function loadMatches() {
    const res = await fetch(
      `/api/matches?tournament_id=${tournamentId}`
    );
    matches = await res.json();
  }

  // Start new round
  async function startRound() {
    await fetch('/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tournament_id: tournamentId
      })
    });

    await loadMatches();
  }

  // Get player name from id
  function getPlayerName(id) {
    if (!id) return '-';

    const player = tournamentPlayers.find((p) => p.id === id);
    return player ? player.name : 'Unknown';
  }

  onMount(async () => {
    await loadTournamentPlayers();
    await loadMatches();
  });
</script>

<h1>Tournament #{tournamentId}</h1>

<button on:click={startRound}>
  Start Round
</button>

<h2>Players</h2>

<ul>
  {#each tournamentPlayers as player}
    <li>
      {player.name} - Rating: {player.rating}
    </li>
  {/each}
</ul>

<h2>Matches</h2>

<ul>
  {#if matches.length === 0}
    <li>No matches found.</li>
  {:else}
    {#each matches as match}
      <li>
        {getPlayerName(match.player1_id)}
        vs
        {getPlayerName(match.player2_id)}

        —
        Winner:
        {match.winner_id
          ? getPlayerName(match.winner_id)
          : "Not decided"}
      </li>
    {/each}
  {/if}
</ul>
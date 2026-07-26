<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  const tournamentId = page.params.id;

  let tournamentPlayers = $state([]);
  let allPlayers = $state([]);
  let matches = $state([]);
  let rankings = $state([]);

  let selectedPlayerId = $state('');

  // Load all players
  async function loadAllPlayers() {
    const res = await fetch('/api/players');
    allPlayers = await res.json();
  }

  // Load players in this tournament
  async function loadTournamentPlayers() {
    const res = await fetch(
      `/api/tournament-players?tournament_id=${tournamentId}`
    );
    tournamentPlayers = await res.json();
  }

  // Add player to tournament
  async function addPlayerToTournament() {
    if (!selectedPlayerId) {
      alert('Please select a player.');
      return;
    }

    await fetch('/api/tournament-players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tournament_id: Number(tournamentId),
        player_id: Number(selectedPlayerId)
      })
    });

    selectedPlayerId = '';

    await loadTournamentPlayers();
  }

  // Load matches
  async function loadMatches() {
    const res = await fetch(
      `/api/matches?tournament_id=${tournamentId}`
    );
    matches = await res.json();
  }

  // Load rankings
  async function loadRankings() {
    const res = await fetch(
      `/api/rankings?tournament_id=${tournamentId}`
    );
    rankings = await res.json();
  }

  // Start a new round
  async function startRound() {
    await fetch('/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tournament_id: Number(tournamentId)
      })
    });

    await loadMatches();
    await loadRankings();
  }

  // Get player name by id
  function getPlayerName(id) {
    if (!id) return 'Not decided';

    const player = tournamentPlayers.find((p) => p.id === id);
    return player ? player.name : 'Unknown';
  }

  onMount(async () => {
    await loadAllPlayers();
    await loadTournamentPlayers();
    await loadMatches();
    await loadRankings();
  });
</script>

<h1>Tournament #{tournamentId}</h1>

<hr />

<h2>Add Player to Tournament</h2>

<select bind:value={selectedPlayerId}>
  <option value="">Select Player</option>

  {#each allPlayers as player}
    <option value={player.id}>
      {player.name} ({player.rating})
    </option>
  {/each}
</select>

<button on:click={addPlayerToTournament}>
  Add Player
</button>

<hr />

<h2>Tournament Players</h2>

{#if tournamentPlayers.length === 0}
  <p>No players added.</p>
{:else}
  <ul>
    {#each tournamentPlayers as player}
      <li>
        <strong>{player.name}</strong>
        - Rating: {player.rating}
      </li>
    {/each}
  </ul>
{/if}

<hr />

<button on:click={startRound}>
  Start Round
</button>

<h2>Matches</h2>

{#if matches.length === 0}
  <p>No matches available.</p>
{:else}
  <ul>
    {#each matches as match}
      <li>
        <strong>{getPlayerName(match.player1_id)}</strong>
        vs
        <strong>{getPlayerName(match.player2_id)}</strong>

        <br />

        Winner:
        {match.winner_id
          ? getPlayerName(match.winner_id)
          : 'Not decided'}
      </li>
    {/each}
  </ul>
{/if}

<hr />

<h2>Rankings</h2>

{#if rankings.length === 0}
  <p>No rankings available.</p>
{:else}
  <ol>
    {#each rankings as rank}
      <li>
        <strong>{rank.name}</strong>
        — {rank.wins} wins
      </li>
    {/each}
  </ol>
{/if}
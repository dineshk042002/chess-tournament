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

<div class="max-w-3xl mx-auto p-6 space-y-8">
  <h1 class="text-3xl font-bold text-slate-800">Tournament #{tournamentId}</h1>

  <section>
    <h2 class="text-xl font-semibold text-slate-700 mb-3">Add Player to Tournament</h2>
    <div class="flex gap-2">
      <select bind:value={selectedPlayerId} class="border border-slate-300 rounded px-3 py-2 flex-1">
        <option value="">Select Player</option>
        {#each allPlayers as player}
          <option value={player.id}>{player.name} ({player.rating})</option>
        {/each}
      </select>
      <button onclick={addPlayerToTournament} class="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
        Add Player
      </button>
    </div>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-slate-700 mb-3">Tournament Players</h2>
    {#if tournamentPlayers.length === 0}
      <p class="text-slate-500">No players added.</p>
    {:else}
      <ul class="space-y-2">
        {#each tournamentPlayers as player}
          <li class="bg-white border border-slate-200 rounded px-4 py-3 shadow-sm">
            <strong>{player.name}</strong> <span class="text-slate-500">— Rating: {player.rating}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section>
    <button onclick={startRound} class="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700">
      Start Round
    </button>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-slate-700 mb-3">Matches</h2>
    {#if matches.length === 0}
      <p class="text-slate-500">No matches available.</p>
    {:else}
      <ul class="space-y-2">
        {#each matches as match}
          <li class="bg-white border border-slate-200 rounded px-4 py-3 shadow-sm">
            <strong>{getPlayerName(match.player1_id)}</strong> vs <strong>{getPlayerName(match.player2_id)}</strong>
            <br />
            <span class="text-amber-700 font-medium">Winner: {match.winner_id ? getPlayerName(match.winner_id) : 'Not decided'}</span>
          </li>
        {/each}
      </ul>
    {/if}
  </section>

  <section>
    <h2 class="text-xl font-semibold text-slate-700 mb-3">Rankings</h2>
    {#if rankings.length === 0}
      <p class="text-slate-500">No rankings available.</p>
    {:else}
      <ol class="space-y-2 list-decimal list-inside">
        {#each rankings as rank}
          <li class="bg-white border border-slate-200 rounded px-4 py-3 shadow-sm inline-block w-full">
            <strong>{rank.name}</strong> — {rank.wins} wins
          </li>
        {/each}
      </ol>
    {/if}
  </section>
</div>
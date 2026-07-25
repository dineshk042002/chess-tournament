import { json } from "@sveltejs/kit";
import db from '../../../lib/server/db.js';

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
  
}
export async function POST({ request }) {
  const data = await request.json();

  const players = db.prepare(`
    SELECT players.* FROM players
    JOIN tournament_players ON players.id = tournament_players.player_id
    WHERE tournament_players.tournament_id = ?
  `).all(data.tournament_id);

  const shuffled = shuffle(players);

for (let i = 0; i < shuffled.length; i += 2) {
    const player1 = shuffled[i];
    const player2 = shuffled[i + 1];
    if (!player2) continue;
    const winner = Math.random() < 0.5 ? player1 : player2;
    db.prepare('INSERT INTO matches (tournament_id, player1_id, player2_id, winner_id, round_number) VALUES (?, ?, ?, ?, ?)').run(data.tournament_id, player1.id, player2.id, winner.id, 1);
  }
  return json({ success: true });
}
export function GET({ url }) {
  const tournamentId = url.searchParams.get('tournament_id');
  const matches = db.prepare('SELECT * FROM matches WHERE tournament_id = ?').all(tournamentId);
  return json(matches);
}

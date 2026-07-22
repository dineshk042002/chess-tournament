import { json } from "@sveltejs/kit";
import db from '../../../lib/server/db.js';

export async function POST({ request }) {
  const data = await request.json();
  db.prepare('INSERT INTO tournament_players (tournament_id, player_id) VALUES (?, ?)').run(data.tournament_id, data.player_id);
  return json({ success: true });
}

export function GET({ url }) {
  const tournamentId = url.searchParams.get('tournament_id');
  const players = db.prepare(`
    SELECT players.* FROM players
    JOIN tournament_players ON players.id = tournament_players.player_id
    WHERE tournament_players.tournament_id = ?
  `).all(tournamentId);
  return json(players);
}
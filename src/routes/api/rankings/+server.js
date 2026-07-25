import { json } from "@sveltejs/kit";
import db from '../../../lib/server/db.js';

export function GET({ url }) {
  const tournamentId = url.searchParams.get('tournament_id');
  const rankings = db.prepare(`
    SELECT players.id, players.name, COUNT(matches.winner_id) as wins
    FROM players
    JOIN matches ON players.id = matches.winner_id
    WHERE matches.tournament_id = ?
    GROUP BY players.id
    ORDER BY wins DESC
    LIMIT 3
  `).all(tournamentId);
  return json(rankings);
}
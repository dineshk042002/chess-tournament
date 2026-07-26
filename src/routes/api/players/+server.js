import { json } from "@sveltejs/kit";
import db from '../../../lib/server/db.js';

export function GET(){
    const players = db.prepare('SELECT * FROM players ').all();
    return json(players);
}
export async function POST({ request }) {
  const data = await request.json();
  db.prepare('INSERT INTO players (name, rating) VALUES (?, ?)').run(data.name, data.rating);
  return json({ success: true });
}
export async function PUT({ request }) {
  const data = await request.json();
  db.prepare('UPDATE players SET name = ?, rating = ? WHERE id = ?').run(data.name, data.rating, data.id);
  return json({ success: true });
}
export async function DELETE({ request }) {
  const data = await request.json();
  db.prepare('DELETE FROM matches WHERE player1_id = ? OR player2_id = ? OR winner_id = ?').run(data.id, data.id, data.id);
  db.prepare('DELETE FROM tournament_players WHERE player_id = ?').run(data.id);
  db.prepare('DELETE FROM players WHERE id = ?').run(data.id);
  return json({ success: true });
}
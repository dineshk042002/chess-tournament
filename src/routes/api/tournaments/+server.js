import { json } from "@sveltejs/kit";
import db from '../../../lib/server/db.js';

export function GET(){
    const tournaments = db.prepare('SELECT * FROM tournaments').all();
    return json(tournaments);
}
export async function POST({ request }) {
  const data = await request.json();
  db.prepare('INSERT INTO tournaments (name, location, start_date, end_date) VALUES (?, ?, ?, ?)').run(data.name, data.location, data.start_date, data.end_date);
  return json({ success: true });
}
export async function PUT({ request }) {
  const data = await request.json();
  db.prepare('UPDATE tournaments SET name = ?, location = ?, start_date = ?, end_date = ? WHERE id = ?').run(data.name, data.location, data.start_date, data.end_date, data.id);
  return json({ success: true });
}

export async function DELETE({ request }) {
  const data = await request.json();
  db.prepare('DELETE FROM matches WHERE tournament_id = ?').run(data.id);
  db.prepare('DELETE FROM tournament_players WHERE tournament_id = ?').run(data.id);
  db.prepare('DELETE FROM tournaments WHERE id = ?').run(data.id);
  return json({ success: true });
}
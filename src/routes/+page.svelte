<div class="min-h-screen flex items-center justify-center animated-bg">
  <div class="max-w-2xl mx-auto p-6 text-center bg-white/90 rounded-xl shadow-lg">
    <h1 class="text-4xl font-bold text-slate-800 mb-4">Chess Tournament Manager</h1>
    <p class="text-slate-600 mb-8">Manage players, run tournaments, and track rankings.</p>

    <div class="flex justify-center gap-4">
      <a href="/players" class="bg-slate-800 text-white px-6 py-3 rounded hover:bg-slate-700">
        Manage Players
      </a>
      <a href="/tournaments" class="bg-amber-600 text-white px-6 py-3 rounded hover:bg-amber-700">
        View Tournaments
      </a>
    </div>
  </div>
</div>

<style>
  .animated-bg {
    background: linear-gradient(-45deg, #1e293b, #334155, #b45309, #92400e);
    background-size: 400% 400%;
    animation: gradientShift 12s ease infinite;
  }

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
</style>
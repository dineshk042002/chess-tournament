<script>
        import './layout.css';
        import favicon from '$lib/assets/favicon.svg';
        let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<nav class="bg-slate-800 text-white px-6 py-4 flex gap-6">
  <a href="/" class="hover:text-amber-400 font-medium">Home</a>
  <a href="/players" class="hover:text-amber-400 font-medium">Players</a>
  <a href="/tournaments" class="hover:text-amber-400 font-medium">Tournaments</a>
</nav>

{@render children()}
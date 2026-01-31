<template>
  <div class="min-h-screen bg-slate-900 text-slate-200 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500/30">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <header class="mb-12 text-center">
         <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] tracking-tight">
           API SENTINEL
         </h1>
         <p class="mt-2 text-slate-500 font-mono text-sm tracking-widest uppercase">
           Real-time Health Monitoring System
         </p>
      </header>

      <!-- Main Content -->
      <main class="space-y-8">
         <MonitorForm />
         <DashboardTable />
      </main>

      <!-- Footer -->
      <footer class="mt-16 text-center text-slate-600 text-xs font-mono">
         <p>SYSTEM STATUS: ONLINE</p>
         <p class="mt-1 opacity-50">v2.0.0 (Nuxt 3 Migration)</p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'API Sentinel | Health Monitor',
  meta: [
    { name: 'description', content: 'Real-time API Health Monitoring Dashboard' }
  ]
})
</script>

<template>
  <div class="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700 neon-border-pink mt-6">
    <div class="flex justify-between items-center mb-6">
       <h2 class="text-2xl font-bold text-pink-500 neon-text-pink flex items-center gap-2">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
         Live Feed
       </h2>
       <div class="text-xs font-mono text-slate-500 animate-pulse flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500"></span>
          REFRESH_RATE: 5000ms
       </div>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm text-slate-300">
        <thead class="bg-slate-900/50 text-xs uppercase font-bold text-slate-400">
           <tr>
             <th class="px-4 py-3 rounded-tl-lg">Target</th>
             <th class="px-4 py-3">Status</th>
             <th class="px-4 py-3">Limits (H/F)</th>
             <th class="px-4 py-3">Streak</th>
             <th class="px-4 py-3">Latency</th>
             <th class="px-4 py-3 rounded-tr-lg">Last Scan</th>
           </tr>
        </thead>
        <tbody class="divide-y divide-slate-700/50">
           <!-- Loading State -->
           <tr v-if="pending && items.length === 0">
              <td colspan="6" class="px-4 py-12 text-center text-slate-500">
                 <div class="flex flex-col items-center gap-2">
                    <span class="animate-spin h-6 w-6 border-2 border-slate-600 border-t-cyan-500 rounded-full"></span>
                    <span class="italic text-xs">calibrating sensors...</span>
                 </div>
              </td>
           </tr>
           
           <!-- Error State -->
           <tr v-else-if="error && items.length === 0">
               <td colspan="6" class="px-4 py-12 text-center text-red-400">
                  <div class="flex flex-col items-center gap-2">
                      <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                      <span class="block text-lg font-bold">NO SIGNAL DETECTED</span>
                      <span class="text-xs font-mono bg-red-900/20 px-2 py-1 rounded">{{ error }}</span>
                  </div>
               </td>
           </tr>

           <!-- Empty State -->
           <tr v-else-if="!pending && items.length === 0">
               <td colspan="6" class="px-4 py-12 text-center text-slate-500 italic">No protocols active. Register a monitor to begin.</td>
           </tr>

           <!-- Data Rows -->
           <tr v-for="item in items" :key="item.endpoint_id" class="hover:bg-cyan-900/10 transition-colors pointer-events-none group">
              <td class="px-4 py-3 font-mono text-cyan-300 group-hover:text-cyan-200 truncate max-w-xs transition-colors">{{ item.URL_endpoint }}</td>
              <td class="px-4 py-3">
                 <span v-if="item.health_status === 'HEALTHY'" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-900/30 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]">
                   <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> HEALTHY
                 </span>
                 <span v-else-if="item.health_status === 'UNHEALTHY'" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-900/30 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                    <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> UNHEALTHY
                 </span>
                 <span v-else class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-700/50 text-slate-400 border border-slate-600/30">
                    <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span> UNKNOWN
                 </span>
              </td>
              <td class="px-4 py-3 font-mono text-xs text-slate-400">
                H:{{ item.healthy_threshold }} / F:{{ item.failure_threshold }}
              </td>
              <td class="px-4 py-3 font-mono text-slate-300">{{ item.streak }}</td>
              <td class="px-4 py-3 font-mono text-pink-300 text-xs">--</td>
              <td class="px-4 py-3 text-slate-500 text-xs font-mono">{{ formatTime(item.last_checked_at) }}</td>
           </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
const items = ref<any[]>([]);
const error = ref<string | null>(null);

// Using useFetch for server-side proxy handling
const { data, refresh, pending, error: fetchError } = await useFetch('/api/state', {
    method: 'GET',
    lazy: true,
    server: false, // Client-side polling only
    default: () => []
});

watchEffect(() => {
    if (fetchError.value) {
        error.value = fetchError.value.message;
        // Don't clear items on error to prevent flickering if one poll fails
    } else {
        error.value = null;
        if (data.value) items.value = data.value as any[];
    }
});

// Polling Logic
let timer: any;
onMounted(() => {
    timer = setInterval(() => {
        refresh();
    }, 5000);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});

function formatTime(timestamp: number) {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleTimeString();
}
</script>

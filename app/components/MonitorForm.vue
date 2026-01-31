<template>
  <div class="p-6 bg-slate-800 rounded-lg shadow-lg border border-slate-700 neon-border-cyan">
    <h2 class="text-2xl font-bold mb-6 text-cyan-400 neon-text-cyan flex items-center gap-2">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
      Initialize Protocol
    </h2>
    
    <form @submit.prevent="registerHelper" class="space-y-4">
      <!-- Target URL -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Target URL</label>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          </div>
          <input 
            v-model="form.url" 
            type="url" 
            required
            placeholder="https://api.example.com"
            class="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:border-cyan-500 text-slate-100 transition-colors placeholder-slate-600"
          />
        </div>
      </div>

      <!-- Method -->
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-1">Method</label>
        <select v-model="form.method" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:border-cyan-500 text-slate-100 transition-colors">
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <!-- Headers & Body Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
           <label class="block text-sm font-medium text-slate-300 mb-1">Headers (JSON)</label>
           <textarea v-model="form.headers" rows="3" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:border-cyan-500 text-slate-100 transition-colors font-mono text-xs"></textarea>
        </div>
        <div>
           <label class="block text-sm font-medium text-slate-300 mb-1">Body (JSON)</label>
           <textarea v-model="form.body" rows="3" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md focus:outline-none focus:border-cyan-500 text-slate-100 transition-colors font-mono text-xs"></textarea>
        </div>
      </div>

      <!-- Settings Grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
           <label class="block text-xs font-medium text-slate-400 mb-1">Timeout (ms)</label>
           <input v-model.number="form.timeout" type="number" class="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded focus:border-cyan-500 text-slate-100 text-sm">
        </div>
        <div>
           <label class="block text-xs font-medium text-slate-400 mb-1">Status Code</label>
           <input v-model.number="form.expected_status_code" type="number" class="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded focus:border-cyan-500 text-slate-100 text-sm">
        </div>
        <div>
           <label class="block text-xs font-medium text-slate-400 mb-1">Latency Max</label>
           <input v-model.number="form.latency_threshold" type="number" class="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded focus:border-cyan-500 text-slate-100 text-sm">
        </div>
         <div>
           <label class="block text-xs font-medium text-slate-400 mb-1">Healthy Thresh</label>
           <input v-model.number="form.healthy_threshold" type="number" class="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded focus:border-cyan-500 text-slate-100 text-sm">
        </div>
         <div>
           <label class="block text-xs font-medium text-slate-400 mb-1">Failure Thresh</label>
           <input v-model.number="form.failure_threshold" type="number" class="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded focus:border-cyan-500 text-slate-100 text-sm">
        </div>
      </div>
      
      <!-- Interval Slider -->
      <div class="pt-2">
         <label class="block text-sm font-medium text-slate-300 mb-1 flex justify-between">
           <span>Scan Interval</span>
           <span class="text-cyan-400 font-mono">{{ form.schedule_interval }}ms</span>
         </label>
         <input 
           v-model.number="form.schedule_interval" 
           type="range" 
           min="3000" 
           max="60000" 
           step="1000"
           class="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
         />
         <p class="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            // MINIMUM SAFE INTERVAL: 3000ms
         </p>
      </div>

      <!-- Action -->
      <button 
        type="submit" 
        :disabled="loading"
        class="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md shadow-lg shadow-cyan-500/50 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <span v-if="loading" class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        <span v-if="!loading">INITIATE</span>
      </button>

      <!-- Feedback -->
      <div v-if="error" class="p-3 bg-red-900/50 border border-red-500 rounded text-red-200 text-sm flex items-start gap-2">
         <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
         <span>[ERROR] {{ error }}</span>
      </div>
      <div v-if="success" class="p-3 bg-green-900/50 border border-green-500 rounded text-green-200 text-sm flex items-center gap-2">
         <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
         <span>Signal Locked. Protocol Active.</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const form = reactive({
  url: 'https://www.google.com',
  method: 'GET',
  headers: '{"Authorization": "Bearer token"}',
  body: '{"key": "value"}',
  timeout: 5000,
  expected_status_code: 200,
  latency_threshold: 1000,
  healthy_threshold: 3,
  failure_threshold: 3,
  schedule_interval: 10000
})

const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<boolean>(false)

async function registerHelper() {
    loading.value = true
    error.value = null
    success.value = false

    try {
        let headersParsed = {};
        let bodyParsed = {};

        try {
            headersParsed = JSON.parse(form.headers || '{}');
        } catch (e) {
            throw new Error('Invalid JSON in Headers');
        }

        try {
            bodyParsed = JSON.parse(form.body || '{}');
        } catch (e) {
            throw new Error('Invalid JSON in Body');
        }

        const payload = {
            enabled: true,
            request: {
                url: form.url,
                method: form.method,
                headers: headersParsed,
                body: bodyParsed
            },
            health_rules: {
                timeout_ms: form.timeout,
                expected_status: form.expected_status_code,
                latency_threshold_ms: form.latency_threshold
            },
            schedule: {
                // Ensure interval limit
                interval_ms: form.schedule_interval < 3000 ? 3000 : form.schedule_interval
            },
            streak_rules: {
                healthy_threshold: form.healthy_threshold,
                failure_threshold: form.failure_threshold
            }
        }

        const { data, error: fetchError } = await useFetch('/api/monitor', {
            method: 'POST',
            body: payload
        })

        if (fetchError.value) {
            throw new Error(fetchError.value.data?.error || fetchError.value.statusMessage || 'Failed to register')
        }

        success.value = true
    } catch (e: any) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}
</script>

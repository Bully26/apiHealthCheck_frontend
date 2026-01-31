// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
  routeRules: {
    '/api/monitor': { proxy: 'http://hyperverge-monitoring-alb-444601760.ap-south-1.elb.amazonaws.com/monitor' },
    '/api/state': { proxy: 'http://hyperverge-monitoring-alb-444601760.ap-south-1.elb.amazonaws.com/state' },
  }
})

import { defineConfig, presetAttributify, presetWind3 } from 'unocss'

export default defineConfig({
  theme: {
    brand: {
    },
  },
  shortcuts: {
    'btn': 'py-1 px-3 rounded shadow bg-indigo-600 text-slate-200 hover:bg-indigo-700',
    'btn-outline': 'py-1 px-3 rounded shadow bg-transparent text-indigo-600 hover:bg-indigo-100 border border-indigo-500',
    'card': 'p-4 shadow-md rounded bg-slate-100/60',
  },
  presets: [
    presetWind3(),
    presetAttributify(),
  ],
})

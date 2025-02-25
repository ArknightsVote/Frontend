import { defineConfig, presetAttributify, presetWind3 } from 'unocss'

export default defineConfig({
  theme: {
    brand: {
    },
  },
  shortcuts: {
    btn: 'py-1 px-3 rounded shadow bg-indigo-600 text-slate-200 hover:bg-indigo-700',
  },
  presets: [
    presetWind3(),
    presetAttributify(),
  ],
})

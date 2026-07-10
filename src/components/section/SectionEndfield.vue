<script setup lang="ts">
import fzwikiLogo from '@/assets/images/fzwiki-logo.svg'
import zmdmapLogo from '@/assets/images/zmdmap-logo.png'

const links = [
  {
    logo: fzwikiLogo,
    name: '终末地 Wiki',
    badge: '正在开发中',
    desc: '玩家社区维护的《明日方舟：终末地》百科，角色、武器、敌人、任务等资料一站式查询。',
    url: 'https://www.fz.wiki',
    label: '前往 fz.wiki →',
  },
  {
    logo: zmdmapLogo,
    name: '终末地地图 · ZMDMAP',
    badge: '',
    desc: '《明日方舟：终末地》地图资源查询站，地图、素材与资源点一站式查阅。',
    url: 'https://zmdmap.com',
    label: '前往 zmdmap.com →',
  },
]
</script>

<template>
  <Section title="友情链接">
    <div class="divide-y divide-gray-200">
      <div
        v-for="link in links"
        :key="link.url"
        class="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
      >
        <AppLink :to="link.url" class="shrink-0">
          <img :src="link.logo" :alt="link.name" class="w-16 h-16 object-contain">
        </AppLink>
        <div class="space-y-1">
          <p class="flex items-center gap-2 font-medium text-gray-800">
            {{ link.name }}
            <span
              v-if="link.badge"
              class="text-xs font-normal px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"
            >
              {{ link.badge }}
            </span>
          </p>
          <p class="text-gray-700 leading-relaxed text-sm">
            {{ link.desc }}
          </p>
          <AppLink
            :to="link.url"
            class="text-blue-600 hover:text-blue-800 underline inline-flex items-center gap-1"
          >
            {{ link.label }}
          </AppLink>
        </div>
      </div>
    </div>
  </Section>
</template>

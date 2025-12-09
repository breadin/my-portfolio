<template>
  <div
    ref="containerRef"
    class="w-full bg-gray-100 px-4 sm:px-6 lg:px-8 py-8"
  >
    <!-- Carousel -->
    <div class="w-full mx-auto mb-8">
      <Carousel
        v-if="slides.length"
        :slides="slides"
        autoplay
        loop
        :interval="5000"
      />
    </div>

    <!-- Full-width cards layout (still derived from same cards data) -->
    <div class="w-full mx-auto">
      <div
        class="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
      >
        <a
          v-for="card in cards"
          :key="card.slug"
          :href="withBase(card.route)"
          class="group flex flex-col w-full rounded-xl overflow-hidden border border-gray-300 bg-white shadow-sm 
                 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 focus:outline-none 
                 focus:ring-2 focus:ring-gray-400"
        >
          <!-- Cover Image -->
          <div class="w-full h-48 overflow-hidden">
            <img
              v-if="card.image"
              :src="card.image"
              alt="cover image"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500"
            >
              No Image
            </div>
          </div>

          <!-- Text Content -->
          <div class="flex-1 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                {{ card.title }}
              </h2>
              <h3 class="text-sm font-medium text-gray-600 mb-2">
                {{ card.name }}
              </h3>
              <p
                class="text-gray-700 text-sm leading-snug line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
              >
                {{ card.excerpt }}
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import Carousel from './Carousel.vue'

type Card = {
  slug: string
  title: string
  name: string
  excerpt: string
  route: string      // `/works/?id=slug`
  image: string | null
}

type Slide = {
  id: string
  title: string
  subtitle: string
  description: string
  image: string | null
  href: string
}

const containerRef = ref<HTMLElement | null>(null)

const markdownFiles = import.meta.glob('../../../works/**/index.md', {
  as: 'raw',
  eager: true,
})
const imageFiles = import.meta.glob('../../../works/**/cover.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

const cards = ref<Card[]>([])

for (const path in markdownFiles) {
  const raw = markdownFiles[path] as string
  const lines = raw.split('\n')

  const titleLine = lines.find(line => line.startsWith('# '))
  const nameLine = lines.find(line => line.startsWith('## '))
  const excerptLine = lines.find(line => line.trim() && !line.startsWith('#'))

  // docs/works/my-work/index.md -> slug = "my-work"
  const match = path.match(/works\/([^/]+)\/index\.md$/)
  const slug = match?.[1] ?? ''

  const route = `/works/?id=${slug}`

  const folder = path.replace(/\/index\.md$/, '/')
  const imageKey = Object.keys(imageFiles).find(k => k.startsWith(folder))

  cards.value.push({
    slug,
    title: titleLine?.replace(/^# /, '') || 'Untitled',
    name: nameLine?.replace(/^## /, '') || 'Anonymous',
    excerpt: excerptLine || '',
    route,
    image: imageKey ? (imageFiles[imageKey] as string) : null,
  })
}

// Derive slides for the carousel from the cards data
const slides = computed<Slide[]>(() =>
  cards.value.map(card => ({
    id: card.slug,
    title: card.title,
    subtitle: card.name,
    description: card.excerpt,
    image: card.image,
    href: withBase(card.route),
  }))
)
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
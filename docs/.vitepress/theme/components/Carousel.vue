<template>
  <div
    class="relative w-full overflow-hidden rounded-2xl bg-white shadow-md"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Slides -->
    <div
      class="flex transition-transform duration-500 ease-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(slide, index) in slides"
        :key="slide.id ?? index"
        class="w-full flex-shrink-0"
      >
        <component
          :is="slide.href ? 'a' : 'div'"
          :href="slide.href"
          class="group block w-full h-full"
        >
          <div class="relative h-64 sm:h-80 md:h-96 w-full">
            <img
              v-if="slide.image"
              :src="slide.image"
              :alt="slide.title || 'slide image'"
              class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500"
            >
              No Image
            </div>

            <!-- Overlay text -->
            <div
              class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4 sm:p-6"
            >
              <h2
                v-if="slide.title"
                class="text-lg sm:text-2xl font-semibold text-white"
              >
                {{ slide.title }}
              </h2>
              <p
                v-if="slide.subtitle"
                class="text-xs sm:text-sm text-gray-200 mt-1"
              >
                {{ slide.subtitle }}
              </p>
              <p
                v-if="slide.description"
                class="mt-2 text-xs sm:text-sm text-gray-100 line-clamp-2 group-hover:line-clamp-none transition-all duration-300"
              >
                {{ slide.description }}
              </p>
            </div>
          </div>
        </component>
      </div>
    </div>

    <!-- Desktop navigation arrows -->
    <button
      v-if="slides.length > 1"
      type="button"
      class="hidden sm:flex items-center justify-center absolute inset-y-0 left-3 my-auto h-10 w-10 rounded-full bg-black/40 text-white 
             hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70"
      @click.stop="prev"
      aria-label="Previous slide"
    >
      ‹
    </button>
    <button
      v-if="slides.length > 1"
      type="button"
      class="hidden sm:flex items-center justify-center absolute inset-y-0 right-3 my-auto h-10 w-10 rounded-full bg-black/40 text-white 
             hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/70"
      @click.stop="next"
      aria-label="Next slide"
    >
      ›
    </button>

    <!-- Mobile tap areas (large, invisible zones) -->
    <button
      v-if="slides.length > 1"
      type="button"
      class="sm:hidden absolute inset-y-0 left-0 w-1/3"
      @click.stop="prev"
      aria-label="Previous slide"
    />
    <button
      v-if="slides.length > 1"
      type="button"
      class="sm:hidden absolute inset-y-0 right-0 w-1/3"
      @click.stop="next"
      aria-label="Next slide"
    />

    <!-- Dots indicators -->
    <div
      v-if="slides.length > 1"
      class="absolute bottom-3 inset-x-0 flex justify-center gap-2"
    >
      <button
        v-for="(slide, index) in slides"
        :key="slide.id ?? index"
        type="button"
        class="h-2.5 rounded-full transition-all duration-300"
        :class="[
          currentIndex === index ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
        ]"
        @click.stop="goTo(index)"
      >
        <span class="sr-only">Go to slide {{ index + 1 }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
} from 'vue'

export interface Slide {
  id?: string | number
  title?: string
  subtitle?: string
  description?: string
  image?: string | null
  href?: string
}

const props = defineProps<{
  slides: Slide[]
  autoplay?: boolean
  interval?: number
  loop?: boolean
}>()

const currentIndex = ref(0)
const isHovered = ref(false)
const effectiveInterval = computed(() => props.interval ?? 5000)

let timer: number | null = null

const next = () => {
  if (!props.slides.length) return
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++
  } else if (props.loop) {
    currentIndex.value = 0
  }
}

const prev = () => {
  if (!props.slides.length) return
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else if (props.loop) {
    currentIndex.value = props.slides.length - 1
  }
}

const goTo = (index: number) => {
  if (index < 0 || index >= props.slides.length) return
  currentIndex.value = index
}

const stopAutoplay = () => {
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  if (!props.autoplay || props.slides.length <= 1) return

  timer = window.setInterval(() => {
    if (!isHovered.value) {
      next()
    }
  }, effectiveInterval.value)
}

const onMouseEnter = () => {
  isHovered.value = true
}

const onMouseLeave = () => {
  isHovered.value = false
}

watch(
  () => [props.autoplay, props.interval, props.slides.length],
  () => {
    startAutoplay()
  }
)

onMounted(() => {
  startAutoplay()
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>
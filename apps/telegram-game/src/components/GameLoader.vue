<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-orange-300 to-violet-600" :class="{ 'transform -translate-x-full duration-500': !isLoading }">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/5">
      <div class="flex flex-col justify-center items-center gap-0 text-white">
        <p class="text-lg font-semibold">
          hmbanan666's
        </p>
        <p class="text-4xl font-semibold">
          Woodlands
        </p>

        <Component :is="LucideLoaderCircle" class="mt-6 w-8 h-8 animate-spin opacity-40" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isLoading } from '@/utils/gameClient'
import LucideLoaderCircle from '~icons/lucide/loader-circle'
</script>

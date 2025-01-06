<template>
  <div class="my-16 px-4 max-w-4xl mx-auto text-center">
    <div class="mb-8 space-y-4">
      <h1 class="text-2xl md:text-3xl lg:text-4xl">
        Интерактивная онлайн-игра в Telegram
      </h1>
      <p class="text-base md:text-lg lg:text-xl">
        Группа игроков сопровождает Машину из точки А в точку Б. По пути встречаются препятствия, от которых нужно избавляться. Все это транслируется на <a href="https://twitch.tv/hmbanan666" target="_blank" class="opacity-70 duration-200 hover:opacity-100 hover:text-emerald-600">Twitch стриме</a>.
      </p>
    </div>

    <div class="max-w-160 mx-auto flex flex-col md:flex-row gap-4 items-center justify-center">
      <a href="https://t.me/ChatGameSpaceBot" target="_blank" class="px-12 py-5 w-full bg-emerald-500 border-b-6 border-emerald-600 text-white text-xl font-semibold tracking-wide rounded-lg cursor-pointer hover:opacity-85 active:scale-95 duration-200 flex flex-row justify-center items-center gap-3">
        <Icon name="simple-icons:telegram" class="!w-8 !h-8" />
        <p>Открыть игру</p>
      </a>
      <a href="https://github.com/chat-game/space" target="_blank" class="px-12 py-5 w-full bg-orange-900/75 border-b-6 border-orange-900/75 text-white text-xl font-semibold tracking-wide rounded-lg cursor-pointer hover:opacity-85 active:scale-95 duration-200 flex flex-row justify-center items-center gap-3">
        <Icon name="simple-icons:github" class="!w-8 !h-8" />
        <p>GitHub</p>
        <div class="flex flex-row items-center gap-1">
          <Icon name="lucide:star" class="!w-5 !h-5" />
          <p>14</p>
        </div>
      </a>
    </div>
  </div>

  <div class="wagon-block">
    <div class="wagon">
      <img src="~/assets/img/wagon-full.png" alt="">
    </div>
  </div>

  <div id="characters" class="max-w-4xl mt-16 px-4 mx-auto text-center space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl md:text-2xl lg:text-3xl">
        Персонажи из игры
      </h2>
      <p>Создаются вручную. Разблокируются за Монеты и за участие в событиях.</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="char in characters"
        :key="char.id"
        class="relative aspect-square bg-orange-800/5 rounded-lg border border-b-4 border-orange-800/5 duration-200 group hover:border-orange-800/50 hover:-translate-y-1"
      >
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <img :src="`/units/${char.codename}/128.png`" alt="" class="w-20 h-20 block group-hover:hidden">
          <img :src="`/units/${char.codename}/idle.gif`" alt="" class="w-20 h-20 hidden group-hover:block">
          <p class="mt-2 text-orange-900/85 font-semibold">
            {{ char.nickname }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <div id="shop" class="max-w-4xl mt-24 px-4 mx-auto text-center space-y-6">
    <div class="space-y-2">
      <h2 class="text-2xl md:text-2xl lg:text-3xl">
        Магазин
      </h2>
      <p>Отличный способ поддержки проекта. Спасибо!</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div v-for="product in shopProducts" :key="product.id" class="relative bg-orange-800/5 rounded-lg border border-b-4 border-orange-800/5 duration-200 group hover:border-orange-800/50 hover:-translate-y-1">
        <div class="bg-orange-500/5 bg-contain bg-no-repeat bg-bottom h-16 rounded-t-lg" :class="product.style" />
        <div class="p-4 flex flex-col justify-between">
          <div class="mb-4 text-xl font-semibold">
            {{ product.coins }} Монет
          </div>

          <div class="">
            <form method="POST" action="/api/payment">
              <input type="hidden" name="productId" :value="product.id">
              <button class="px-6 py-3 w-full bg-teal-500 border-b-4 border-teal-600 text-white text-xl tracking-wide rounded-lg cursor-pointer hover:opacity-85 active:scale-95 duration-200 flex flex-row justify-center items-center gap-3">
                {{ product.price }} ₽
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <p>
      Можешь <NuxtLink to="/donate" class="text-emerald-600">
        поддержать стримера
      </NuxtLink> другими способами.
    </p>
  </div>

  <div class="max-w-4xl mt-24 px-4 mx-auto text-center space-y-6">
    <h2 class="text-2xl md:text-2xl lg:text-3xl">
      Благодарности от hmbanan666
    </h2>
    <p class="text-lg thanks-block">
      Спасибо моим зрителям: <a :href="localePath('/p/kungfux010')">kungfux010</a> за активные тесты игры, <a :href="localePath('/p/sava5621')">sava5621</a> за вкусные шавухи, <a :href="localePath('/p/bezsovesty')">BezSovesty</a> за помощь на
      старте, <a :href="localePath('/p/flack_zombi')">flack_zombi</a> за упорство в рубке деревьев, <a :href="localePath('/p/player_mmcm')">player_mmcm</a> за первые тесты Дополнения, <a :href="localePath('/p/a_hywax')">a_hywax</a> за помощь с open source, <a :href="localePath('/p/peregonstream')">PeregonStream</a> и <a :href="localePath('/p/siberiacancode')">siberiacancode</a> за крутые рейды.
      Спасибо <a :href="localePath('/p/tozikab_')">tozikab_</a>, <a :href="localePath('/p/6alt1ca')">6alt1ca</a>, <a :href="localePath('/p/derailon')">derailon</a>, <a :href="localePath('/p/sloghniy')">sloghniy</a>, <a :href="localePath('/p/man0ol')">MaN0ol</a>, <a :href="localePath('/p/do_oy')">dO_Oy</a>, <a :href="localePath('/p/vombatdrago')">VombatDrago</a>,
      <a :href="localePath('/p/sleeplessness8')">sleeplessness8</a>.
      <br>Вы все крутые!
    </p>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Интерактивная онлайн-игра в Telegram',
  meta: [
    {
      name: 'description',
      content: 'Группа игроков сопровождает Машину из точки А в точку Б. По пути встречаются препятствия, от которых нужно избавляться.',
    },
  ],
})

const localePath = useLocalePath()
const { data: characters } = await useFetch('/api/character')

const shopProducts = [
  {
    id: 'jehj4mxo0g6fp1eopf3jg641',
    price: 110,
    coins: 10,
    style: 'shop-block-1',
  },
  {
    id: 'w0895g3t9q75ys2maod0zd1a',
    price: 450,
    coins: 60,
    style: 'shop-block-2',
  },
  {
    id: 'nar1acws8c3s4w3cxs6i8qdn',
    price: 1250,
    coins: 180,
    style: 'shop-block-3',
  },
  {
    id: 'tp5w874gchf6hjfca9vory2r',
    price: 2150,
    coins: 330,
    style: 'shop-block-4',
  },
  {
    id: 'izh5v4vxztqi55gquts9ukn2',
    price: 3900,
    coins: 650,
    style: 'shop-block-5',
  },
]
</script>

<style scoped>
.wagon-block {
  width: 100%;
  margin: 2em 0;
  padding: 4em 0;
  background-image: url(~/assets/img/background-green.webp);
}

.wagon {
  margin: 0 auto;
  width: fit-content;
  text-align: center;
}

.wagon img {
  width: 50vw;
  max-width: fit-content;
}

.thanks-block {
  a {
    color: var(--color-emerald-600);
    font-weight: 600;

    &:hover {
      opacity: 0.8;
    }
  }
}

.shop-block-1 {
  background-image: url(~/assets/img/shop/block-1.png);
}

.shop-block-2 {
  background-image: url(~/assets/img/shop/block-2.png);
}

.shop-block-3 {
  background-image: url(~/assets/img/shop/block-3.png);
}

.shop-block-4 {
  background-image: url(~/assets/img/shop/block-4.png);
}

.shop-block-5 {
  background-image: url(~/assets/img/shop/block-5.png);
}
</style>

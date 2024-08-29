<template>
  <section class="hero">
    <h1>"{{ character?.nickname }}" {{ character?.name }}</h1>
    <h2>
      Игровой персонаж, созданный
      <NuxtLink :to="localePath(`/p/${character?.profile.userName}`)">
        {{ character?.profile.userName }}
      </NuxtLink>
    </h2>

    <div class="unit-avatar">
      <img :src="`/units/${character?.codename}/idle.gif`" alt="" class="game-canvas" width="256" height="256">
    </div>
  </section>

  <section v-if="character?.isReady" class="activation-block">
    <div v-if="alreadyHaveCharacter">
      <div v-if="profileData?.activeEditionId === alreadyHaveCharacter?.id" class="active-character">
        Это твой активный Персонаж {{ alreadyHaveCharacter.level }} уровня
      </div>
      <button v-else class="submit-button" @click="activateCharacter">
        <div>Активировать Персонажа</div>
      </button>

      <div class="bonus">
        + 1 Монета за новый уровень
      </div>
      <div class="bonus">
        + 5 очков "Коллекционера" за новый уровень
      </div>
    </div>

    <div v-else>
      <div v-if="character.unlockedBy === 'COINS'">
        <button type="submit" class="submit-button" :disabled="!isEnoughCoins" @click="unlockCharacter">
          <div>Разблокировать персонажа</div>
          <div class="price">
            Стоимость: {{ character.price }} Монет <img src="~/assets/img/icons/coin/64.png" alt="" width="22" height="22">
          </div>
        </button>

        <div v-if="character.id === twitchyId" class="bonus">
          Стартовый Персонаж
        </div>
        <div v-else class="bonus">
          + {{ character.price }} очков "Коллекционера"
        </div>
      </div>
      <div v-else>
        Персонажа нельзя разблокировать за Монеты
      </div>
    </div>
  </section>

  <section class="info-block">
    <div class="inner-wrapper">
      <div class="card progression">
        <p class="title">
          Уровень проработанности
        </p>
        <p class="lvl">
          Обычный
        </p>
      </div>

      <div class="card meta">
        <p class="title">
          Авторство:
        </p>
        <p>Анимации: hmbanan666</p>
      </div>

      <div class="card description">
        <p class="title">
          Краткая информация:
        </p>
        {{ character?.description }}
      </div>
    </div>
  </section>

  <div class="progress-top">
    <div class="common" />
    <div class="uncommon" />
    <div class="rare" />
    <div class="epic" />
    <div class="legendary" />
  </div>

  <section v-if="character?.isReady" class="top-chars">
    <h2>Топ владельцев</h2>
    <p class="description">
      Кто "прокачал" этого персонажа лучше всех?
    </p>

    <div v-if="topEditions?.length" class="block">
      <div v-for="edition in topEditions" :key="edition.id">
        <NuxtLink :to="localePath(`/p/${edition.profile.userName}`)">
          <p>{{ edition.profile.userName }}</p>
        </NuxtLink>
        <p class="level">
          {{ edition.level }} уровень
        </p>
      </div>
    </div>
    <p v-else class="empty">
      Пока нет владельцев
    </p>
  </section>

  <section class="posts-block">
    <h2>Пользовательские посты</h2>
    <p class="description">
      Это могут быть истории или новая информация о характере и судьбе персонажа.
    </p>

    <div class="feed">
      <div v-if="profileData" class="add-post">
        <div class="content">
          <div class="action">
            Добавить новый пост
          </div>

          <div class="form-control">
            <textarea v-model="postText" name="text" placeholder="Пиши, не стесняйся. Максимум 1500 символов" rows="4" maxlength="1500" />
          </div>

          <button class="submit-button" :disabled="!isReadyToPost" @click="addPost">
            <div>Отправить сообщение</div>
            <div class="price">
              Стоимость: 5 Маны <img src="~/assets/img/icons/mana/64.png" alt="" width="22" height="22">
            </div>
          </button>

          <div class="bonus">
            + 5 очков "Рассказчика"
          </div>
          <div class="bonus">
            + 1 очко "Рассказчика" за каждый Лайк
          </div>
        </div>
      </div>

      <p v-if="!posts?.length" class="empty">
        Пока нет постов
      </p>

      <div v-for="post in posts" :key="post.id" class="post">
        <img src="/units/twitchy/128.png" alt="" class="avatar">
        <div class="content">
          <div class="info">
            <div class="desc">
              <NuxtLink :to="localePath(`/p/${post.profile.userName}`)">
                {{ post.profile.userName }}
              </NuxtLink> добавил(а) новую заметку
            </div>
            <time>
              {{ useLocaleTimeAgo(new Date(post.createdAt)) }}
            </time>
          </div>
          <div class="message">
            {{ post.text }}

            <div class="likes-block">
              <button :data-liked="post.likes.some(l => l.profileId === profileData?.id)" @click="addLike(post.id)">
                <ThumbsUp :size="30" />
                {{ post.rating }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ThumbsUp } from 'lucide-vue-next'

definePageMeta({
  validate: async (route) => {
    const { error } = await useFetch(`/api/character/${route.params.id}`)
    return error.value === undefined
  },
})

const localePath = useLocalePath()
const route = useRoute()
const { data: character } = await useFetch(`/api/character/${route.params.id}`)
const { data: topEditions } = await useFetch(`/api/character/${route.params.id}/top`)
const { data: posts } = await useFetch(`/api/character/${route.params.id}/post`)

const { user } = useUserSession()
const { data: profileData } = await useFetch(`/api/profile/userName/${user.value?.userName}`)

const twitchyId = 'staoqh419yy3k22cbtm9wquc'
const alreadyHaveCharacter = profileData.value?.characterEditions.find((e) => e.characterId === character.value?.id)
const coins = profileData.value?.coins ?? 0
const mana = profileData.value?.mana ?? 0
const price = character.value?.price ?? 0
const isEnoughCoins = profileData ? coins >= price : false

const postText = ref('')
const isReadyToPost = computed(() => postText.value.length > 10 && mana >= 5)

async function activateCharacter() {
  const { data } = await useFetch(`/api/character/${route.params.id}/activate`, {
    method: 'POST',
  })

  if (data.value) {
    location.reload()
  }
}

async function unlockCharacter() {
  const { data } = await useFetch(`/api/character/${route.params.id}/unlock`, {
    method: 'POST',
  })

  if (data.value) {
    location.reload()
  }
}

async function addLike(postId: string) {
  const { data } = await useFetch(`/api/post/${postId}/like`, {
    method: 'POST',
  })

  if (data.value) {
    location.reload()
  }
}

async function addPost() {
  const { data } = await useFetch(`/api/character/${route.params.id}/post`, {
    method: 'POST',
    body: {
      text: postText.value,
    },
  })

  if (data.value) {
    location.reload()
  }
}
</script>

<style scoped>
  .empty {
    color: var(--bronze-9)
  }

  .top-chars {
    padding: 4em 1em;

    .description {
      text-align: center;
      margin-bottom: 1em;
    }

    .block {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2em;
      align-items: center;

      .level {
        color: var(--bronze-9);
      }
    }
  }

  .posts-block {
    .description {
      text-align: center;
      margin-bottom: 1.5em;
    }

    .bonus {
      text-align: center;
      margin-top: 0.5em;
      color: var(--bronze-9);
    }
  }

  .activation-block {
    text-align: center;
    padding: 1em 1em 5em;

    .submit-button {
      display: block;
      width: 100%;
      max-width: 25em;
      padding: 0.75em 1em;
      margin: 0 auto;
      border: 3px solid var(--bronze-6);
      background-color: var(--green-9);
      background: linear-gradient(130deg, var(--green-9) 0%, var(--green-8) 100%);
      color: var(--bronze-2);
      font-family: inherit;
      font-size: 1.2rem;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
      }

      .price {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        margin-top: 0.5em;
        font-size: 0.9rem;
        text-transform: none;
      }

      &:disabled {
        cursor: not-allowed;
        background-color: var(--gray-9);
        background: linear-gradient(130deg, var(--gray-9) 0%, var(--gray-8) 100%);
      }
    }

    .active-character {
      font-size: 1.2rem;
    }

    .bonus {
      margin-top: 0.5em;
      color: var(--bronze-9);
    }
  }

  .unit-avatar {
    position: relative;
    overflow: visible;
    width: 14em;
    height: 14em;
    margin: 2em auto 0;
    background-image: url(~/assets/img/background-green.webp);
    border: 4px solid var(--color-border);

    .game-canvas {
      position: relative;
      padding: 1em 0 0 2em;
    }

    @media screen and (max-width: 768px) {
      .game-canvas {
        padding: 0.75em 0 0 1em;
        width: 100%;
        height: 100%;
      }
    }
  }

  .info-block {
    padding: 3em 0;
    max-width: none;
    background-color: var(--brown-4);
    background: linear-gradient(130deg, var(--brown-5) 0%, var(--brown-4) 100%);
    color: var(--brown-11);

    .inner-wrapper {
      width: 100%;
      max-width: 56em;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(1, 1fr);
      gap: 1em;

      @media (min-width: 620px) {
        & {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (min-width: 1020px) {
        & {
          grid-template-columns: repeat(3, 1fr);
        }
      }

      .card {
        background-color: var(--brown-2);
        border-left: 0.25em solid var(--brown-7);
        padding: 1em;
        text-align: left;

        .title {
          font-weight: 600;
        }
      }
    }

    .progression {
      .lvl {
        font-size: 1.8rem;
      }
    }

    .meta {
      text-align: left;
    }

    .description {
      text-align: left;
    }
  }

  .progress-top {
    position: relative;
    display: flex;
    height: 0.5em;
    opacity: 0.5;

    &:after {
      content: "";
      position: absolute;
      top: -1em;
      left: 1%;
      border-style: solid;
      border-color: var(--slate-4);
      border-width: 0 4px 4px 0;
      display: inline-block;
      padding: 4px;
      transform: rotate(45deg);
    }

    .common {
      background: var(--color-common);
      width: 100%;
    }

    .uncommon {
      background: var(--color-uncommon);
      width: 100%;
    }

    .rare {
      background: var(--color-rare);
      width: 100%;
    }

    .epic {
      background: var(--color-epic);
      width: 100%;
    }

    .legendary {
      background: var(--color-legendary);
      width: 100%;
    }
  }

  .feed {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    max-width: 32em;
    margin: 0 auto;

    .post {
      display: flex;
      position: relative;
      text-align: left;
      margin-bottom: 1em;

      &::before {
        background-color: var(--bronze-6);
        bottom: -32px;
        content: "";
        left: calc(28px - 1px);
        position: absolute;
        top: 0;
        width: 2px;
      }

      &:first-child:before {
        top: 48px;
      }

      &:last-child:before {
        visibility: hidden;
      }

      .avatar {
        height: 48px;
        width: 48px;
        background-color: var(--bronze-4);
        border: 2px solid var(--bronze-6);
        padding: 0.2em;
        margin-right: 1em;
        position: relative;
        flex-shrink: 0;
        z-index: 1;
      }

      .content {
        flex-grow: 1;

        .info {
          time {
            font-size: 0.8rem;
            color: var(--bronze-9);
          }

          .desc {
            line-height: 1.1;

            a {
              font-style: normal;
              font-weight: 600;
            }
          }
        }

        .message {
          border: 2px solid var(--bronze-6);
          padding: 0.75em 1em;
          margin-top: 0.85em;
          unicode-bidi: embed;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .likes-block {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-end;
          margin-top: 0.5em;

          button {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 0.15em;
            background-color: var(--gray-3);
            padding: 0.2em 0.5em;
            border: 2px solid var(--gray-5);
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--gray-9);
            transition: 0.2s all ease-in-out;

            &:hover {
              opacity: 0.8;
              transform: scale(0.96);
              color: var(--ruby-9);
              background-color: var(--ruby-3);
              border: 2px solid var(--ruby-5);
            }

            &[data-liked='true'] {
              background-color: var(--ruby-3);
              border: 2px solid var(--ruby-5);
              color: var(--ruby-9);
            }
          }
        }
      }
    }
  }

  .add-post {
    display: flex;
    position: relative;
    text-align: left;
    margin-bottom: 3em;

    .action {
      margin-bottom: 0.5em;
    }

    .content {
      flex-grow: 1;
    }

    .form-control {
      margin-bottom: 0.5em;

      textarea {
        width: 100%;
        padding: 1em;
        border: 2px solid var(--bronze-6);
        background: var(--bronze-3);
        box-sizing: border-box;
        font-size: 1rem;
        color: var(--bronze-12);
        font-family: inherit;
        max-width: 100%;
        min-width: 100%;
        min-height: 6em;
        resize: vertical;

        &:focus {
          outline: none;
          border: 2px solid var(--green-7);
        }
      }
    }

    .submit-button {
      display: block;
      width: 100%;
      padding: 0.75em 1em;
      background-color: var(--green-9);
      color: var(--bronze-3);
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.2s;
      margin-top: 0.25em;

      &:hover {
        opacity: 0.9;
      }

      &:disabled {
        cursor: not-allowed;
        background-color: var(--gray-9);
      }

      .price {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;
        margin-top: 0.5em;
        font-size: 0.9rem;
        text-transform: none;
      }
    }
  }
</style>

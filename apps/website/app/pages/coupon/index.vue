<template>
  <section class="hero">
    <h1>Купон</h1>
    <h2>
      Уже встречался <a href="https://twitch.tv/hmbanan666" target="_blank">на стриме?</a>
    </h2>

    <div class="coupons-block">
      <img src="~/assets/img/icons/coupon/128.png" alt="banana coupon">
      <img src="~/assets/img/icons/coupon/128.png" alt="banana coupon">
      <img src="~/assets/img/icons/coupon/128.png" alt="banana coupon">
    </div>
  </section>

  <section class="latest-coupons">
    <h2 class="title">
      Последние активации
    </h2>
    <p class="desc">
      На стриме периодически появляются сообщения с инструкцией, как получить
      купон.
    </p>

    <div class="block">
      <div v-for="coupon in coupons" :key="coupon.id" class="card">
        <div>
          <img src="/units/twitchy/128.png" alt="" width="64" height="64">
          <div class="coupon">
            <img src="~/assets/img/icons/coupon/64.png" alt="" width="32" height="32">
          </div>
        </div>
        <div>
          <a :href="localePath(`/p/${coupon.profile?.userName}`)">{{ coupon.profile?.userName }}</a>
        </div>
        <time>{{ useLocaleTimeAgo(new Date(coupon.createdAt)) }}</time>
      </div>
    </div>
  </section>

  <section class="game-info">
    <h2 class="title">
      Куда его можно потратить
    </h2>
    <p class="desc">
      Выбирай с умом!
    </p>

    <div class="grid">
      <div class="block">
        <div class="header">
          <h3>Обменять на Монеты</h3>
        </div>
        <div class="info">
          <p>
            Курс пока статичный, но кто знает... Активированные купоны пойдут на переработку.
          </p>

          <div class="course">
            <img src="~/assets/img/icons/coupon/64.png" alt="" width="32" height="32">
            <div>1 Купон = 2 Монеты</div>
            <img src="~/assets/img/icons/coin/64.png" alt="" width="32" height="32">
          </div>

          <button class="submit-button" :disabled="!isEnoughCoupons" @click="activateCouponToCoins">
            Активировать купон
          </button>
        </div>
      </div>

      <p class="hint">
        Предложи свою идею на стриме
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const { data: coupons } = await useFetch('/api/coupon/latest')

const { user } = useUserSession()
const { data: profileData } = await useFetch(`/api/profile/userName/${user.value?.userName}`)
const isEnoughCoupons = profileData.value && profileData.value?.coupons > 0

async function activateCouponToCoins() {
  const { data } = await useFetch('/api/coupon', {
    method: 'POST',
    body: {
      type: 'COINS',
    },
  })

  if (data.value) {
    location.reload()
  }
}
</script>

<style scoped>
  .coupons-block {
    position: relative;
    width: 10em;
    margin: 1.5em auto 0;

    img:first-child {
      position: absolute;
      top: 1em;
      left: -3.5em;
      width: 4em;
      height: 4em;
      opacity: 0.8;
    }

    img:last-child {
      position: absolute;
      bottom: 1em;
      right: -2em;
      width: 2.5em;
      height: 2.5em;
      opacity: 0.7;
    }
  }

  .latest-coupons {
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;

    .title {
      margin-bottom: 0.25em;
    }

    .desc {
      margin-bottom: 1.5em;
    }

    .block {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5em;

      @media (min-width: 768px) {
        & {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (min-width: 1200px) {
        & {
          grid-template-columns: repeat(6, 1fr);
        }
      }

      .card {
        background-color: var(--color-background-2);
        border: 2px solid var(--color-border-2);
        padding: 1em;

        time {
          font-size: 0.8rem;
        }

        .coupon {
          position: relative;
          display: inline;
        }
      }
    }
  }

  .game-info {
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;

    .title {
      margin-bottom: 0.25em;
    }

    .desc {
      margin-bottom: 1.5em;
    }

    .grid {
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

      .hint {
        width: 6em;
        text-align: center;
        margin: 25% auto 0;
        opacity: 0.3;
      }
    }

    .block {
      border: 3px solid var(--color-border);
      background: var(--orange-3);

      .header {
        padding: 1.2em 1em;
        color: var(--color-background);
        background-color: var(--color-bg-accent-1);
      }

      .info {
        padding: 1em 1em;

        p {
          font-weight: 500;
        }

        .course {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5em;
          margin-top: 1em;
        }
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
    margin-top: 0.5em;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      cursor: not-allowed;
      background-color: var(--gray-9);
    }
  }
</style>

<template>
  <aside :class="{ opened: isFeedOpened }">
    <div class="inner-block">
      <div class="top-block">
        <div class="profile-block">
          <a :href="localePath(`/p/${profile?.userName}`)" class="name">
            {{ profile?.userName }}
          </a>

          <div class="currency-block">
            <div v-if="profile && profile?.mana > 0" class="currency">
              <div class="counter">
                {{ profile.mana }}
              </div>
              <img src="~/assets/img/icons/mana/64.png" alt="" width="36" height="36">
            </div>

            <div v-if="profile && profile?.coins > 0" class="currency">
              <div class="counter">
                {{ profile.coins }}
              </div>
              <img src="~/assets/img/icons/coin/64.png" alt="" width="36" height="36">
            </div>

            <div v-if="profile && profile?.coupons > 0" class="currency">
              <div class="counter">
                {{ profile.coupons }}
              </div>
              <img src="~/assets/img/icons/coupon/64.png" alt="" width="36" height="36">
            </div>
          </div>
          <button class="sign-out" @click="clear">
            Выйти
          </button>
        </div>

        <button class="close" @click="() => isFeedOpened = false">
          <X :size="38" />
        </button>
      </div>

      <div class="feed">
        <div class="block-title">
          Последние события
        </div>

        <TransactionBlock v-for="transaction in transactions" :key="transaction.id" :transaction="transaction as unknown as TransactionWithProfile" />
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { TransactionWithProfile } from '@chat-game/types'
import { X } from 'lucide-vue-next'

const { isFeedOpened } = useApp()
const localePath = useLocalePath()
const { user, clear } = useUserSession()
const { data: profile } = await useFetch(`/api/profile/userName/${user.value?.userName}`)
const { data: transactions } = await useFetch('/api/transaction')
</script>

<style scoped>
  aside {
    background-color: var(--orange-1);
    position: relative;
    width: 0;
    visibility: hidden;
    display: block;
    transition: 0.2s all;

    &.opened {
      visibility: visible;
      width: 24em;
      border-left: 0.15em solid var(--brown-4);
    }

    @media (max-width: 1024px) {
      & {
        display: none;
      }
    }

    .inner-block {
      display: flex;
      flex-direction: column;
      gap: 0.5em;

      .top-block {
        position: sticky;
        top: 0;
        padding: 1em 1em;
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: 0.5em;
        background-color: var(--orange-1);

        .close {
          transition: 0.2s all;
          color: var(--brown-9);

          &:hover {
            scale: 1.2;
            color: var(--brown-8);
          }
        }

        .profile-block {
          background-color: var(--brown-3);
          color: var(--brown-11);
          flex-grow: 1;
          padding: 0.5em 0.75em;
          border-radius: 0.5em;
          border-left: 0.15em solid var(--brown-5);
          border-bottom: 0.15em solid var(--brown-5);

          .name {
            width: 100%;
            display: block;
            color: inherit;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.3rem;
            margin-bottom: 0.25em;
            transition: 0.2s all;

            &:hover {
              text-decoration: none;
              color: var(--green-9);
            }
          }

          .sign-out {
            font-weight: 600;
            transition: 0.2s all;

            &:hover {
              color: var(--green-9);
            }
          }

          .currency-block {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            gap: 0.5em;
            margin-bottom: 0.75em;

            .currency {
              position: relative;
              display: inline-block;

              & .counter {
                position: absolute;
                bottom: -4px;
                left: 50%;
                transform: translateX(-50%);
                color: var(--brown-2);
                font-weight: 700;
                font-size: 0.8rem;
                background: var(--brown-10);
                padding: 0 0.4em;
                border-radius: 6px;
              }
            }
          }
        }
      }
    }
  }

  .block-title {
    color: var(--brown-10);
  }

  .feed {
    padding: 0 1em 1em;
    display: flex;
    flex-direction: column;
    gap: 0.75em;
  }
</style>

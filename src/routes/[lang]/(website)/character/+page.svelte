<script lang='ts'>
  import type { Profile } from '@hmbanan666/chat-game-api'
  import { page } from '$app/stores'
  import coinSmall from '$lib/assets/website/coin-64.png'

  export let data

  const profile = $page.data.profileData as Profile | null
</script>

<section class='hero'>
  <h1>Игровые персонажи</h1>
  <h2>Игроки сами создают и "прокачивают" персонажей. Можно "арендовать" на неделю, получить доступ к странице,
    создавать посты и делать активности.</h2>

  <div class='currency-block'>
    <div class='currency'>
      <img src={coinSmall} alt="" width='48' height='48' />
      <div class='right'>
        <p class='counter'>{profile?.coins}</p>
        <p class='description'>Монет</p>
      </div>
    </div>

    <a href='/{$page.data.locale}/character/new'>Создать нового [в разработке]</a>
  </div>
</section>

<section class='characters'>
  {#each data.characters as char}
    <div class='block bg-paper'>
      <div class='header'>
        <a href='/{$page.data.locale}/character/{char.id}'>
          <h3>{char.name}</h3>
        </a>
      </div>
      <div class='info'>
        <p>{char.description}</p>
      </div>
    </div>
  {/each}
</section>

<style>
    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    h1 {
        margin-bottom: 0.25em;
    }

    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }

    .characters {
        text-align: center;
        margin: 0 auto;
        padding-top: 2em;
        padding-bottom: 4em;
        max-width: 64em;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1em;
    }

    @media (min-width: 620px) {
        .characters {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1020px) {
        .characters {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .characters .block {
        border: 3px solid var(--color-border);
    }

    .block .header {
        padding: 1.2em 1em;
        color: var(--color-background);
        background: var(--color-bg-accent-2);
    }

    .block .header a {
        color: var(--color-background);
    }

    .block .info {
        padding: 1em 1em;
    }

    .block .info p {
        font-weight: 500;
    }

    .currency-block {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5em;
      margin-top: 2em;
      background-color: var(--bronze-3);
      border: 2px solid var(--bronze-5);
      padding: 1em;

      & .currency {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: center;
        gap: 0.75em;

        & .right {
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;
          align-items: flex-start;
          justify-content: center;

          & .counter {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.2;
            color: var(--green-10);
          }

          & .description {
            font-size: 0.9rem;
          }
        }
      }

      & a {
        padding: 0.5em 1em;
        border: 2px solid var(--brown-7);
        background-color: var(--violet-10);
        color: var(--brown-3);
        font-weight: 600;
        transition: all 0.2s;

        &:hover {
          opacity: 0.9;
          text-decoration: none;
        }
      }
    }
</style>

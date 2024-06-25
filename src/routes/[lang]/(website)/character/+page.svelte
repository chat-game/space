<script lang='ts'>
  import { page } from '$app/stores'

  export let data
</script>

<section class='hero'>
  <h1>Игровые персонажи</h1>
  <h2>Игроки сами создают и "прокачивают" персонажей. Можно "арендовать" на неделю, получить доступ к странице,
    создавать посты и делать активности.</h2>
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
</style>

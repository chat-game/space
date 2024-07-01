<script>
  import Trophy from 'lucide-svelte/icons/trophy'

  export let data
</script>

<section class='hero'>
  <h1>Трофеи</h1>
  <h2>Столько всего можно сделать...</h2>
</section>

<section class='trophies'>
  {#each data.trophies as trophy}
    <div class='trophy-block'>
      <div class='info'>
        <p class='name'>{trophy.name}</p>
        <p class='description'>{trophy.description}</p>
      </div>
      <div class='completion'>
        <div class='trophy'>
          <Trophy size='64' />
        </div>
        <div>
          <p class='points'>{trophy.points}</p>
          <p>Очков</p>
        </div>
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

    .hero h1 {
        margin-bottom: 0.25em;
    }

    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }

.trophy-block {
      background-color: #FFEFD6;
      border: 2px solid var(--color-border);
      display: grid;
      grid-template-columns: 2fr 1fr;
      margin-bottom: 0.5em;
    }

    .trophy-block .info {
      position: relative;
      padding: 0.5em 1em;
    }

    .trophy-block .info .name {
      font-weight: 600;
      font-size: 1.1rem;
      opacity: 0.8;
    }

    .trophy-block .info .description {
      font-size: 0.9rem;
    }

    .trophy-block .completion {
      position: relative;
      padding: 0.5em 1em;
      color: #A07553;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 0.5em;
    }

    .trophy-block .completion .points {
      font-size: 1.5rem;
      font-weight: 600;
      line-height: 1.2;
    }

    .trophy-block .completion .trophy {
      opacity: 0.3;
      color: #AD7F58;
    }
</style>

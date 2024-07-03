<script>
  import TimeAgo from 'javascript-time-ago'
  import ru from 'javascript-time-ago/locale/ru'
  import trophyImage from '$lib/assets/website/trophy-128.png'
  import { page } from '$app/stores'
  import unit from '$lib/assets/website/unit-64.png'

  export let data

  TimeAgo.addLocale(ru)

  const timeAgo = new TimeAgo('ru-RU')

  const latestProfiles = data.trophy.progress
    .filter((t) => t.status === 'COMPLETED')
    .slice(0, 12)
</script>

<section class='hero'>
  <h1>{data.trophy.name}</h1>
  <h2>
    Трофей, созданный <a href='/{$page.data.locale}/p/hmbanan666'>hmbanan666</a>
  </h2>
</section>

<section class='trophies'>
  <div class='trophy-block'>
    <div class='info'>
      <p class='description'>{data.trophy.description}</p>
    </div>
    <div class='completion'>
      <div class='trophy'>
        <img src={trophyImage} alt="" width='64' height='64' />
      </div>
      <div>
        <p class='points'>{data.trophy.points}</p>
        <p>Очков</p>
      </div>
    </div>
  </div>
</section>

<section class='progress'>
  <h2 class='title'>Кто получил этот трофей</h2>
  <p class='desc'>Показаны последние профили, которые получили этот трофей.</p>

  <div class='block'>
    {#each latestProfiles as progress}
      <div class='card'>
        <div>
          <img src={unit} alt="" />
        </div>
        <div>
          <a href='/{$page.data.locale}/p/{progress.profile.userName}'>{progress.profile.userName}</a>
        </div>
        <time>{timeAgo.format(new Date(progress.completedAt))}</time>
      </div>
    {/each}
  </div>
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
    background-color: #ffefd6;
    border: 2px solid var(--color-border);
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin-bottom: 0.5em;
  }

  .trophy-block .info {
    position: relative;
    padding: 1em 1em;
  }

  .trophy-block .info .description {
    font-size: 0.9rem;
  }

  .trophy-block .completion {
    position: relative;
    padding: 0.5em 1em;
    color: #f76b15;
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
    opacity: 1;
  }

  .progress {
    padding-top: 2em;
    padding-bottom: 4em;
    max-width: 64em;
  }

  .progress .title {
    margin-bottom: 0.25em;
  }

  .progress .desc {
    margin-bottom: 1em;
  }

  .progress .block {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5em;
  }

  @media (min-width: 768px) {
    .progress .block {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .progress .block {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .progress .block .card {
    background-color: var(--color-background-2);
    border: 2px solid var(--color-border-2);
    padding: 1em;
  }

  .progress .block .card time {
    font-size: 0.8rem;
  }
</style>

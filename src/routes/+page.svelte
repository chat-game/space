<script lang="ts">
  import type { PageServerData } from "./$types"
  import { TWITCH_URL } from "$lib/config";
  import wagon from '$lib/assets/website/wagon-full.png';

  export let data: PageServerData
</script>

<svelte:head>
    <title>Интерактивная чат-игра для Twitch</title>
    <meta name="description" content="Стример играет вместе со своей аудиторией. Либо он делает
        перерыв, пока зрители..."/>
</svelte:head>

<section class="hero">
    <h1>
        Интерактивная чат-игра для Twitch
    </h1>
    <h2>Группа игроков сопровождает Машину из точки А в точку Б, не зная, доберутся ли. Зрители могут использовать
        "!команды", которые запускают динамичные действия.</h2>
</section>

<div class="wagon-block">
    <div class="wagon">
        <img src={wagon} alt=""/>
    </div>
</div>

<section>
    <p>Стример играет вместе со своей аудиторией. Либо он делает
        перерыв, пока зрители развлекаются или...</p>
    <p class="mt-2">За все время создано {data.playersCount} юнитов. Присоединяйся <a href={TWITCH_URL} target="_blank"
                                                                                      class="twitch-link">на активном
        стриме</a>!</p>
</section>

<section>
    <p>Огромная благодарность моим зрителям за поддержку: sava5621 за вкусные шавухи, BezSovesty за помощь на
        старте, flack_zombi за упорство в рубке деревьев, PeregonStream за крутые рейды. Спасибо tozikab_, 6alt1ca,
        derailon, sloghniy, MaN0ol, dO_Oy, VombatDrago. Вы все крутые!</p>
</section>

<style>
    section {
        text-align: center;
        padding: 2em 1em;
        margin: 0 auto;
        max-width: 42em;
    }

    .hero {
        padding-top: 4em;
        padding-bottom: 4em;
        max-width: 64em;
    }

    h1 {
        width: 100%;
        margin-bottom: 0.25em;
    }

    h2 {
        text-align: center;
    }

    .twitch-link {
        color: var(--color-twitch);
    }

    .wagon-block {
        width: 100%;
        padding: 4em 0;
        background-image: url($lib/assets/website/background-green.webp);
    }

    .wagon {
        margin: 0 auto;
        width: fit-content;
        text-align: center;
    }

    .wagon img {
        width: 60vw;
        max-width: fit-content;
    }

    .mt-2 {
        margin-top: 1em;
    }
</style>

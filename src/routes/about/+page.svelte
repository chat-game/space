<script>
    import wagon from "$lib/assets/website/wagon-full.png"
</script>

<svelte:head>
    <title>Об игре | Чат-игра для Twitch</title>
    <meta name="description" content="Основная идея игры, что сделано, планы на будущее, благодарности"/>
</svelte:head>

<section class="hero">
    <h1>
        Об игре
    </h1>
    <h2>Фундамент уже готов. <br>Идет большой процесс проработки деталей и создания основного геймплея.</h2>
    <h3 class="mt-4">Ориентир - конец лета 2024.</h3>
</section>

<section class="game-info">
    <div class="block bg-paper">
        <div class="header">
            <h3>Необычный input</h3>
        </div>
        <div class="info">
            <p>Для создания юнита и выполнения разнообразных действий в игре требуется писать команды в Twitch чате.
                Например, написав команду "!рубить", юнит начнет рубить ближайшее дерево.</p>
        </div>
    </div>
    <div class="block bg-paper">
        <div class="header">
            <h3>Генерируемые локации</h3>
        </div>
        <div class="info">
            <p>Путешествуя в открытом мире, игроки встречают уникальные места. Все благодаря динамичной генерации
                чанков и глубокой работе с текстурами. Нет заранее созданной игровой карты.</p>
        </div>
    </div>
    <div class="block bg-paper">
        <div class="header">
            <h3>Квесты</h3>
        </div>
        <div class="info">
            <p>Основные модификаторы игры. Активные квесты меняют доступные команды для игроков. Движение Машины также
                зависит от главного активного задания.</p>
        </div>
    </div>
</section>

<div class="wagon-block">
    <div class="wagon">
        <img src={wagon} alt=""/>
    </div>
</div>

<section>
    <h3 class="mb-2">Благодарности</h3>
    <p>Спасибо моим зрителям: <b>sava5621</b> за вкусные шавухи, <b>BezSovesty</b> за помощь на
        старте, <b>flack_zombi</b> за упорство в рубке деревьев, <b>PeregonStream</b> за крутые рейды.
        Спасибо <b>tozikab_</b>, <b>6alt1ca</b>, <b>derailon</b>, <b>sloghniy</b>, <b>MaN0ol</b>, <b>dO_Oy</b>, <b>VombatDrago</b>,
        <b>sleeplessness8</b>.
        <br>Вы все крутые!</p>
</section>

<style>
    h1 {
        margin-bottom: 0.25em;
    }

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

    .game-info {
        padding-top: 2em;
        padding-bottom: 4em;
        max-width: 64em;
        display: grid;
        grid-template-columns: repeat(1, 1fr);
        gap: 1em;
    }

    @media (min-width: 620px) {
        .game-info {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (min-width: 1020px) {
        .game-info {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .game-info .block {
        border: 3px solid var(--color-border);
    }

    .block .header {
        padding: 1.2em 1em;
        color: var(--color-background);
        background: var(--color-bg-accent-1);
    }

    .block .info {
        padding: 1em 1em;
    }

    .block .info p {
        font-weight: 500;
    }

    .mb-2 {
        margin-bottom: 0.5em;
    }

    .mt-4 {
        margin-top: 1.5em;
    }

    .wagon-block {
        width: 100%;
        margin: 2em 0;
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
</style>
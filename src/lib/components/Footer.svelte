<script>
  import { config } from '$lib/config'
  import { page } from '$app/stores'

  const t = $page.data.t
</script>

<footer>
  <ul>
    <li>
      <a href={config.githubRepoUrl} target='_blank'>{t.footer.github}</a>
    </li>
    <li>
      <a href={config.discordServerInviteUrl} target='_blank'>Discord</a>
    </li>
    <li>
      <a href={config.twitch.url} target='_blank'>Twitch</a>
    </li>
    <li>
      <a href={config.donateUrl} target='_blank'>{t.footer.donate}</a>
    </li>
  </ul>

  <p>{t.footer.text}</p>
</footer>

<style>
    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 12px;
        margin-top: 4em;
        margin-bottom: 2em;
    }

    a {
        font-weight: 600;
        color: inherit;
    }

    a:hover {
        color: var(--green-9);
    }

    @media (min-width: 480px) {
        footer {
            padding: 0.5em 0;
        }
    }

    ul {
        position: relative;
        padding: 0;
        margin: 0 0 0.8em;
        display: flex;
        justify-content: center;
        align-items: center;
        list-style: none;
    }

    li {
        position: relative;
        display: flex;
        gap: 0;
        height: 100%;
    }

    li:not(:last-child):after {
        content: "|";
        font-size: 0.8rem;
        padding: 0 0.5em;
        opacity: 0.3;
    }
</style>

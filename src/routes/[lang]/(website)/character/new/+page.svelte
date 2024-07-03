<script>
  import coinSmall from '$lib/assets/website/coin-64.png'
</script>

<section class='hero'>
  <h1>Создание нового персонажа</h1>
  <h2>Не торопись. Заполни все поля и нажми "Создать".</h2>
</section>

<section class='form'>
  <form method='get'>
    <div class='form-control'>
      <input type='text' placeholder='Прозвище' />
    </div>

    <div class='form-control'>
      <input type='text' placeholder='Имя и фамилия' />
    </div>

    <div class='form-control'>
      <textarea placeholder='Короткая информация' rows='4'></textarea>
    </div>

    <div class='form-control checkbox-block'>
      <input type='checkbox' id='terms' />
      <label for='terms'>Мой контент не нарушает Правила публикации контента</label>
    </div>

    <button type='submit' class='submit-button'>
      <div>Создать персонажа</div>
      <div class='price'>Стоимость: 5 монет <img src={coinSmall} alt="" width='22' height='22' /></div>
    </button>
  </form>
</section>

<section class='terms'>
  <h2>Правила публикации контента</h2>

  <p>1. Контент не должен содержать оскорбительных или дискриминационных элементов.</p>
  <p>2. Избегайте копирования других игровых персонажей.</p>
  <p>3. Не включайте политические темы, религиозные убеждения или социальные комментарии.</p>
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

    .form {
        position: relative;
        max-width: 32em;

        & .form-control {
            margin-bottom: 1em;
        }
    }

    .form-control input, .form-control textarea {
        width: 100%;
        padding: 1em;
        border: 2px solid var(--bronze-7);
        box-sizing: border-box;
        font-size: 1rem;
        color: var(--bronze-12);
        font-family: inherit;
        max-width: 100%;
        min-width: 100%;

        &:focus {
            outline: none;
            border: 2px solid var(--green-7);
        }
    }

    .form-control textarea {
        min-height: 6em;
        resize: vertical;
    }

    .form-control input::placeholder, .form-control textarea::placeholder {
        color: var(--bronze-9);
    }

    .checkbox-block {
        display: flex;
        align-items: center;
        justify-items: left;
        gap: 0.75em;

        & input[type="checkbox"] {
            width: 2em;
            height: 2em;
            min-width: inherit;
            margin: 0;
            border: 2px solid var(--bronze-7);
        }

        & label {
            font-size: 0.9rem;
            text-align: left;
            color: var(--bronze-10);
        }
    }

    .submit-button {
        display: block;
        width: 100%;
        padding: 0.75em 1em;
        border: 2px solid var(--bronze-7);
        background-color: var(--green-9);
        color: var(--bronze-3);
        font-family: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        text-transform: uppercase;
        transition: all 0.2s;

        &:hover {
            opacity: 0.9;
        }

        & .price {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5em;
            margin-top: 0.5em;
            font-size: 0.9rem;
            text-transform: none;
        }
    }

    .terms {
        text-align: left;

        & h2 {
            text-align: center;
            margin-bottom: 0.5em;
        }
    }
</style>

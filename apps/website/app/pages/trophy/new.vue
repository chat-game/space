<template>
  <section class="hero">
    <h1>Создание нового трофея</h1>
    <h2>Не торопись. Заполни все поля и ознакомься с правилами.</h2>
  </section>

  <section class="form">
    <form method="POST" action="/api/trophy">
      <div class="form-control">
        <input type="text" name="name" placeholder="Название трофея" maxlength="35">
      </div>

      <div class="form-control">
        <textarea name="description" placeholder="Короткое описание. Например, за какие заслуги он выдается" rows="3" maxlength="140" />
      </div>

      <div class="form-control checkbox-block">
        <input id="terms" v-model="isCheckedTerms" type="checkbox">
        <label for="terms">Мой контент не нарушает Правила публикации контента</label>
      </div>

      <div class="form-control checkbox-block">
        <input id="agreed" v-model="isCheckedAgreed" type="checkbox">
        <label for="agreed">Согласен с тем, что мой трофей будет проходить модерацию и контент может поменяться</label>
      </div>

      <button type="submit" class="submit-button" :data-ready="isFormReady" :disabled="!isFormReady">
        <div>{{ isFormReady ? 'Создать трофей' : errorLabel }}</div>
        <div class="price">
          Стоимость: 5 Маны <img src="~/assets/img/icons/mana/64.png" alt="" width="22" height="22">
        </div>
      </button>
    </form>
  </section>

  <section class="terms">
    <h2>Правила публикации контента</h2>

    <p>1. Контент не должен содержать оскорбительных или дискриминационных элементов.</p>
    <p>2. Не используй контент из игр, включая существующие образы и данные персонажей. Избегай копирования других трофеев на этом веб-сайте.</p>
    <p>3. Не включай политические темы, религиозные убеждения или социальные комментарии.</p>
  </section>
</template>

<script setup lang="ts">
const { user } = useUserSession()
const { data: profile } = await useFetch(`/api/profile/userName/${user.value?.userName}`)
const isEnoughMana = profile.value && profile.value.mana >= 5

const isCheckedTerms = ref(false)
const isCheckedAgreed = ref(false)
const isFormReady = computed(() => isEnoughMana && isCheckedTerms.value && isCheckedAgreed.value)

const errorLabel = 'Заполни все поля'
</script>

<style scoped>
    .form {
        position: relative;
        max-width: 32em;
        padding-top: 0;

        .form-control {
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
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-items: left;
        gap: 0.75em;

        input[type="checkbox"] {
          width: 1.5em;
          height: 1.5em;
          min-width: 1.5em;
          margin: 0;
          border: 2px solid var(--bronze-7);
        }

        label {
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
        background-color: var(--gray-9);
        color: var(--bronze-3);
        font-family: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        text-transform: uppercase;
        transition: all 0.2s;

        &:hover {
            opacity: 0.9;
        }

        .price {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5em;
            margin-top: 0.5em;
            font-size: 0.9rem;
            text-transform: none;
        }

        &[data-ready=true] {
          background-color: var(--green-9);
        }

        &:disabled {
          cursor: not-allowed;
        }
    }

    .terms {
        text-align: left;

        h2 {
            text-align: center;
            margin-bottom: 0.5em;
        }
    }
</style>

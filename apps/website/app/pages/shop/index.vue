<template>
  <section class="hero">
    <h1>Магазин</h1>
    <h2>Приобретайте Монеты. Спасибо за поддержку проекта!</h2>
  </section>

  <section class="shop">
    <div class="items">
      <div class="item">
        <div class="header block-1" />
        <div class="info">
          <div class="coins">
            <div>10 Монет</div>
          </div>

          <div>+110 очков "Мецената"</div>

          <div class="price-block">
            <form method="POST" action="/api/payment">
              <input type="hidden" name="productId" value="jehj4mxo0g6fp1eopf3jg641">
              <button class="submit-button">
                110 рублей
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="header block-2" />
        <div class="info">
          <div>
            <div class="coins">
              <div>50 Монет</div>
            </div>

            <div class="bonus">
              +10 Монет <div class="badge">
                Бонус!
              </div>
            </div>
          </div>

          <div>+450 очков "Мецената"</div>

          <div class="price-block">
            <div class="regular-price">
              600 рублей
            </div>
            <form method="POST" action="/api/payment">
              <input type="hidden" name="productId" value="w0895g3t9q75ys2maod0zd1a">
              <button class="submit-button">
                450 рублей
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="header block-3" />
        <div class="info">
          <div>
            <div class="coins">
              <div>150 Монет</div>
            </div>

            <div class="bonus">
              +30 Монет <div class="badge">
                Бонус!
              </div>
            </div>
          </div>

          <div>Особый трофей</div>

          <div>+1250 очков "Мецената"</div>

          <div class="price-block">
            <div class="regular-price">
              1800 рублей
            </div>
            <form method="POST" action="/api/payment">
              <input type="hidden" name="productId" value="nar1acws8c3s4w3cxs6i8qdn">
              <button class="submit-button">
                1250 рублей
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="header block-4" />
        <div class="info">
          <div>
            <div class="coins">
              <div>250 Монет</div>
            </div>

            <div class="bonus">
              +80 Монет <div class="badge">
                Бонус!
              </div>
            </div>
          </div>

          <div>Особый трофей</div>

          <div>+2150 очков "Мецената"</div>

          <div class="price-block">
            <div class="regular-price">
              3300 рублей
            </div>
            <form method="POST" action="/api/payment">
              <input type="hidden" name="productId" value="tp5w874gchf6hjfca9vory2r">
              <button class="submit-button">
                2150 рублей
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="item">
        <div class="header block-5" />
        <div class="info">
          <div>
            <div class="coins">
              <div>500 Монет</div>
            </div>

            <div class="bonus">
              +150 Монет <div class="badge">
                Бонус!
              </div>
            </div>
          </div>

          <div class="gentleman">
            <img src="/units/gentleman/idle.gif" alt="" width="98" height="98">
            <div>Уникальный персонаж: Джентельмен</div>
          </div>

          <div>Особый трофей</div>

          <div>+3900 очков "Мецената"</div>

          <div class="price-block">
            <div class="regular-price">
              6500 рублей
            </div>
            <form method="POST" action="/api/payment">
              <input type="hidden" name="productId" value="izh5v4vxztqi55gquts9ukn2">
              <button class="submit-button">
                3900 рублей
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .shop {
    max-width: 56em;
  }

  .items {
    display: grid;
    gap: 1em;
    grid-template-columns: repeat(1, 1fr);

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .item {
    border: 3px solid var(--brown-6);
    background: var(--orange-3);
    display: flex;
    flex-direction: column;
    transition: 0.2s all;

    &:hover {
      border-color: var(--brown-7);
      transform: translateY(-0.25em);

      .header {
        background-position-x: center;
        background-size: cover;
        opacity: 0.85;
      }
    }

    .header {
      background-color: var(--teal-8);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom;
      min-height: 5em;
      transition: 0.2s all;
    }

    .block-1 {
      background-image: url(~/assets/img/shop/block-1.png);
    }

    .block-2 {
      background-image: url(~/assets/img/shop/block-2.png);
    }

    .block-3 {
      background-image: url(~/assets/img/shop/block-3.png);
    }

    .block-4 {
      background-image: url(~/assets/img/shop/block-4.png);
    }

    .block-5 {
      background-image: url(~/assets/img/shop/block-5.png);
    }

    .info {
      padding: 1em;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1em;
      height: 100%;

      .price-block {
        margin-top: auto;
      }

      .regular-price {
        font-size: 0.9rem;
        text-decoration: line-through;
        opacity: 0.6;
      }

      .bonus {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5em;

        .badge {
          background-color: var(--orange-4);
          padding: 0.25em 0.5em;
        }
      }

      .coins {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5em;
        font-size: 1.1rem;
        margin-bottom: 0.25em;
      }

      .gentleman {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25em;
      }
    }
  }

  .submit-button {
    display: block;
    width: 100%;
    padding: 0.75em 1em;
    border: 3px solid var(--brown-5);
    background-color: var(--green-9);
    background: linear-gradient(130deg, var(--green-9) 0%, var(--green-8) 100%);
    color: var(--brown-2);
    font-family: inherit;
    font-size: 1rem;
    cursor: pointer;
    text-transform: uppercase;
    transition: all 0.2s;
    margin-top: 0.5em;

    &:hover {
      opacity: 0.9;
    }

    &:disabled {
      cursor: not-allowed;
      background-color: var(--gray-9);
    }
  }
</style>

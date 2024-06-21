<script>
  import unitAvatar from '$lib/assets/website/unit-512.png'

  export let show = true
</script>

<div class='loader-block' data-active={show}>
  <div class='image-block animate-bounce'>
    <img src={unitAvatar} alt="" width={256} height={256} />
  </div>
</div>

<style>
  .loader-block {
    z-index: 50;
    display: grid;
    place-content: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--color-bg-loader);
    border-style: solid;
    border-color: var(--color-bg-accent-1);
    border-top-width: 35px;
    border-bottom-width: 35px;
    border-left: 0;
    border-right: 0;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transform: translate(-100%)
  }

  .loader-block[data-active=true] {
    transform: translate(0)
  }

  .loader-block[data-active=false] {
    transition-duration: 500ms;
  }

  .image-block {
    margin: 0 auto;
    animation: bounce 1s infinite;
  }

  @keyframes bounce {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
</style>

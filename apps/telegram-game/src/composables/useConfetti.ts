const isShown = ref(false)

function pop() {
  isShown.value = true
  setTimeout(() => {
    isShown.value = false
  }, 5000)
}

export function useConfetti() {
  return { isShown, pop }
}

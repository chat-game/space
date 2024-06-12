<script>
import GameHeader from "./GameHeader.svelte"
import GameLoader from "./GameLoader.svelte"

export let isGameReady
</script>

<GameLoader show={!isGameReady}/>
<GameHeader/>
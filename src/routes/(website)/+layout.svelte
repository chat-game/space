<script lang="ts">
import Footer from "$lib/components/Footer.svelte"
import Header from "$lib/components/Header.svelte"
import "../styles.css"
</script>

<div class="app">
    <Header/>

    <main>
        <slot/>
    </main>

    <Footer/>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        width: 100%;
        min-height: 80vh;
    }
</style>

<script lang="ts">
export let widthInPercent = 0
let title = ""
</script>

<div class="title" style={{width: `${widthInPercent}%`}}>
  {title}
</div>

<style>
  .title {
    border-style: solid;
    border-right-width: 1px;
    border-color: var(--color-border);
    text-align: center;
  }
</style>
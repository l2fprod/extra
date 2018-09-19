<template lang="jade">
  <div>
    <i class="fas fa-user"></i>
    {{ name }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Avatar extends Vue {
  @Prop() private name!: string;
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <v-dialog
    v-model="loading"
    persistent
    width="300"
    content-class="elevation-0"
  >
    <v-card
      class="loading-content"
      dark
    >
      <v-card-text class="loading-content">
        <div v-if="message != null">{{ message }}</div>
        <v-progress-circular
        :size="70"
        :width="5"
        color="amber"
        indeterminate
      ></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class Loading extends Vue {
  @Prop()
  private message?: string;
  @Prop()
  private loading?: boolean;
}
</script>

<style>
.loading-dialog {
  min-height: 500px;
}

.loading-content {
  background-color: transparent !important;
  text-align: center;
}
</style>
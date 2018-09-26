<template>
  <img :src="url" />
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import {Md5} from 'ts-md5/dist/md5';

@Component
export default class Avatar extends Vue {
  @Prop()
  private email?: string;

  get url() {
    if (this.email) {
      return `//www.gravatar.com/avatar/${Md5.hashStr(this.email!.trim().toLowerCase())}?s=64&d=retro&r=g`;
    } else {
      return null;
    }
  }
}
</script>

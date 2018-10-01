<template>
  <div>
    <h2 class="subheading">Routes</h2>
    <ul>
      <li v-for="route in item.doc.routes" v-bind:key="route.guid">
        <a :href="`https://${route.host}.${route.domain.name}`">{{ route.host }}.{{ route.domain.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import CloudFoundryApplication from '@/models/CloudFoundryApplication';

@Component
export default class CloudFoundryApplicationPreview extends Vue {

  @Prop()
  private item?: CloudFoundryApplication;

}
</script>
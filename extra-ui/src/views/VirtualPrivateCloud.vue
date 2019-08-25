<template>
  <v-layout row fill-height>
    <div class="resources-container">
      <v-data-table
        :headers="[
          { text: 'VPC', value: '__vpc.name' },
          { text: 'Subnet', value: '__subnet.name' },
          { text: 'Instance', value: 'name' },
          { text: 'Resource Group', value: '__resourceGroup.name' },
          { text: 'Location', value: 'region', align: 'center' },
          { text: 'Private IP', value: 'doc.primary_network_interface.primary_ipv4_address' },
          { text: 'Floating IP', value: '__floatingIP.doc.address' },
          { text: 'Age', value: 'creation_date', align: 'right' }
        ]"
        :items="instances"
        hide-actions
        class="elevation-1 resources"
        no-data-text="No data available. Use the Refresh button or extend your search."
      >
        <template slot="items" slot-scope="props">
          <tr>
            <td>{{ props.item.__vpc.name }}</td>
            <td>{{ props.item.__subnet ? props.item.__subnet.name : ''}}</td>
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.__resourceGroup.name }}</td>
            <td>{{ props.item.region }}</td>
            <td>{{ props.item.doc.primary_network_interface.primary_ipv4_address }}</td>
            <td>{{ props.item.__floatingIP ? props.item.__floatingIP.doc.address : ''}}</td>
            <td class="text-nowrap text-xs-right">
              <v-tooltip top>
                <span slot="activator">{{ relativeDate(props.item.creation_date) }}</span>
                <span>{{ humanDate(props.item.creation_date) }}</span>
              </v-tooltip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Item from '@/models/Item';

@Component({
  components: {
  },
})
export default class VirtualPrivateCloud extends Vue {

  get instances() {
    return this.$store.getters.filteredByType('instance');
  }
}
</script>

<style lang="scss" scoped>
.resources-container {
  margin-top: 0px;
  min-width: 200px;
  flex: 1;
}

.resources {
  max-height: 100%;
  overflow-x: auto;
  overflow-y: auto;
}
</style>
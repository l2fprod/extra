<template>
  <v-layout row fill-height>
    <l-map :zoom="zoom">
      <l-control-scale :imperial="false" />
      <l-tile-layer
        :url="url"
        :attribution="attribution"
        />
      <l-circle v-for="marker in markers" v-bind:key="marker.id"
        className="location-circle" 
        :lat-lng="[ marker.latitude, marker.longitude ]"
        :radius="marker.radius">
        <l-tooltip>
          <div>
            <b>{{marker.name}}</b>
            <p>
              {{marker.count}} resources
            </p>
          </div>
        </l-tooltip>
      </l-circle>
    </l-map>
  </v-layout>
</template>

<script lang="ts">
import { LMap, LTileLayer, LMarker, LPopup, LCircle, LControlScale, LTooltip } from 'vue2-leaflet';
import { Component, Vue } from 'vue-property-decorator';
import Item from '@/models/Item';
import L from 'leaflet';
import { Location, Locations } from '@/services/Locations';
import RegionFilter from '@/models/filters/RegionFilter';

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LCircle,
    LControlScale,
    LTooltip,
  },
})
export default class Map extends Vue {

  public zoom = 2.2;
  public center = L.latLng(47.413220, -1.219482);
  public url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
  public attribution = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

  get markers() {
    const markers: any[] = [];
    const totalCount = this.$store.state.filteredResources.length;
    Locations.locationsWithCoordinates.forEach((location: Location) => {
      const regionCount = this.$store.getters.filteredResources(new RegionFilter(location.id)).length;
      if (regionCount === 0) {
        return;
      }
      markers.push({
        id: location.id,
        name: location.overview_ui.en.display_name,
        count: regionCount,
        latitude: location.extension!.marker.latitude,
        longitude: location.extension!.marker.longitude,
        radius: Math.max(100000, 1000000 * regionCount / totalCount),
      });
    });
    return markers;
  }
}
</script>

<style>
  @import "../../node_modules/leaflet/dist/leaflet.css";
</style>

<style lang="scss" scope>
.location-circle {
  stroke: cadetblue;
  fill: cadetblue;
}
</style>

<template>
<div id="app">
  <v-app id="app">
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      app
      fixed
      extended
      extension-height="7"
    >
      <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
        <span class="hidden-sm-and-down">My Console</span>
      </v-toolbar-title>
      <v-text-field
        flat
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search resources"
        class="hidden-sm-and-down search"
        autofocus
        v-model="searchWord"
        v-on:keypress.enter="search($event.target.value)"
      ></v-text-field>
      <v-btn color="info" v-on:click="refresh()">
        Refresh
      </v-btn>
      <!-- <Avatar :name="$store.state.user.Email" v-if="$store.state.user != null" /> -->
      <!-- <v-progress-linear slot="extension" :indeterminate="true" class="ma-0">Progress?</v-progress-linear> -->
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout column>
          <router-view/>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer
      height="auto"
      color="primary lighten-1"
      fixed
      app
    >
      <v-layout
        justify-center
        row
        wrap
        white--text
      >
        &copy; 2018 — <strong>fred</strong>
      </v-layout>
    </v-footer>
  </v-app>
</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Avatar from "@/components/Avatar.vue";
import { setTimeout } from "timers";

@Component({
  components: {
    Avatar
  }
})
export default class App extends Vue {

  public search(value: string) {
    console.log("searching for", value);
    this.$store.dispatch("search", value);
  }

  public refresh() {
    this.$store.dispatch("refresh");
  }

  protected mounted() {
    this.$store.dispatch('get');
    this.$store.dispatch('login');
  }

  get searchWord() {
    return this.$store.state.searchWord;
  }

  set searchWord(value) {
    this.$store.dispatch('search', value);
  }
}
</script>

<style lang="scss">
body {
}
</style>

<style lang="scss" scoped>
#app {
}
</style>
<template>
  <v-app id="app">
    <Loading :loading="$store.state.loading" />
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      fixed
      app
    >
      <Faceted ref="faceted" />
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="blue darken-3"
      dark
      app
      fixed
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title style="width: 240px" class="ml-0 pl-3">
        <span class="hidden-sm-and-down">My Dashboard</span>
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
      ></v-text-field>
      <v-btn color="info" v-on:click="refresh()">
        Refresh
      </v-btn>
      <!-- <Avatar :email="$store.state.user.Email" v-if="$store.state.user"/> -->
      <a href="https://github.com/l2fprod/extra">
        <v-icon>fab fa-github</v-icon>
      </a>
    </v-toolbar>
    <v-content class="app-content">
      <v-container column fluid fill-height>
        <v-layout column fill-height>
        <div>
          <span class="font-weight-bold">{{ $store.state.filteredResources.length }}</span>
          of
          <v-tooltip bottom>
            <span slot="activator" class="reset-filter" @click="resetFilter">
              {{ $store.state.resources.length }} resources
            </span>
            <span>Clear search and filters</span>
          </v-tooltip>
        </div>
        <router-view />
        </v-layout>
      </v-container>
    </v-content>
    <v-footer
      :inset="true"
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
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Avatar from '@/components/Avatar.vue';
import Faceted from '@/components/Faceted.vue';
import Loading from '@/components/Loading.vue';

@Component({
  components: {
    Avatar,
    Faceted,
    Loading,
  },
})
export default class App extends Vue {

  private drawer: boolean = true;

  public refresh() {
    this.$store.dispatch('refresh');
  }

  public resetFilter() {
    this.searchWord = '';
    (this.$refs.faceted as Faceted).resetFilter();
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
.v-input__control {
  min-height: 36px !important;
}
</style>

<style lang="scss" scoped>
.app-content {
  height: 100%;
}
.reset-filter {
  text-decoration: underline;
  cursor: pointer;
}
</style>

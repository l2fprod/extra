<template>
  <v-app id="app" :dark="themeDark">
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
      app
      fixed
      color="primary"
    >
      <v-toolbar-side-icon class="white--text" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title style="width: 240px" class="ml-0 pl-3">
        <span class="hidden-sm-and-down white--text">My Dashboard</span>
      </v-toolbar-title>
      <v-text-field
        flat
        dark
        solo-inverted
        hide-details
        prepend-inner-icon="search"
        label="Search resources"
        class="hidden-sm-and-down search"
        autofocus
        v-model="searchWord"
      ></v-text-field>
      <v-spacer />
      <v-btn color="error" v-on:click="refresh()">
        Refresh
      </v-btn>
      <!-- <Avatar :email="$store.state.user.Email" v-if="$store.state.user"/> -->
      <v-btn large icon href="https://github.com/l2fprod/extra">
        <v-icon>fab fa-github</v-icon>
      </v-btn>
      <v-btn large icon dark href="https://twitter.com/l2fprod">
        <v-icon>fab fa-twitter</v-icon>
      </v-btn>
      <!-- <v-btn large icon @click="toggleTheme">
        <v-icon v-show="themeDark==false">fas fa-lightbulb</v-icon>
        <v-icon v-show="themeDark==true">far fa-lightbulb</v-icon>
      </v-btn> -->
    </v-toolbar>
    <v-content class="app-content">
      <v-container column fluid fill-height class="app-container">
        <v-layout column fill-height>
        <div class="item-count">
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
  private themeDark: boolean = false;

  public toggleTheme() {
    this.themeDark = !this.themeDark;
    if (this.themeDark) {
      this.$vuetify.theme.primary = '#78909C';
      this.$vuetify.theme.secondary = '#455A64';
      //   accent: "#607D8B",
      //   error: "#f44336",
      //   warning: "#ffeb3b",
      //   info: "#2196f3",
      //   success: "#4caf50"
      // };
    } else {
      this.$vuetify.theme.primary = '#197596';
      this.$vuetify.theme.secondary = '#FFFFFF';
      //   accent: '#42A5F5',
      //   error: '#f44336',
      //   warning: '#ffeb3b',
      //   info: '#2196f3',
      //   success: '#4caf50',
      // };
    }
  }

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
.v-chip {
  margin-left: 0px;
}
.text-nowrap {
  white-space: nowrap;
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
.app-container {
  padding: 0px;
}
.item-count {
  padding: 10px;
}
</style>

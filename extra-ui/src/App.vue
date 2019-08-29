<template>
  <v-app id=app :dark="themeDark">
    <Loading :loading="$store.state.loading" />
    <v-app-bar app clipped-left>
      <v-toolbar
      fixed
      color="primary"
      >
        <v-app-bar-nav-icon class="white--text" @click="drawer = !drawer"></v-app-bar-nav-icon>
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
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      width="300"
    >
      <Faceted ref="faceted" />
    </v-navigation-drawer>
    <v-content class="app-content">
      <v-container column fluid fill-height class="app-container">
        <v-layout column fill-height>
          <v-layout row class="item-count" align-center>
            <div>
              <v-tooltip top>
                <template v-slot:activator="{ on }"><v-btn icon small to="canoe"><v-icon>view_list</v-icon></v-btn></template>
                <span>View as table</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }"><v-btn icon small to="vpc"><v-icon>cloud_queue</v-icon></v-btn></template>
                <span>Switch to VPC-centric view</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }"><v-btn icon small to="map"><v-icon>language</v-icon></v-btn></template>
                <span>View resources on a world map</span>
              </v-tooltip>
            </div>
            <div>
              <span class="font-weight-bold">{{ $store.state.filteredResources.length }}</span>
              of
              <v-tooltip top>
                <template v-slot:activator="{ on }"><span class="reset-filter" @click="resetFilter">
                  {{ $store.state.resources.length }} resources
                </span></template>
                <span>Clear search and filters</span>
              </v-tooltip>
            </div>
            <v-spacer/>
          </v-layout>
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
        &copy; 2019 — <strong>fred</strong>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Avatar from '@/components/Avatar.vue';
import Faceted from '@/components/Faceted.vue';
import Loading from '@/components/Loading.vue';
import MyCatalog from '@/services/MyCatalog';

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
  private triggerSearchTimeout: number = 0;

  public toggleTheme() {
    this.themeDark = !this.themeDark;
    if (this.themeDark) {
      this.$vuetify.theme.themes.dark.primary = '#78909C';
      this.$vuetify.theme.themes.dark.secondary = '#455A64';
      //   accent: "#607D8B",
      //   error: "#f44336",
      //   warning: "#ffeb3b",
      //   info: "#2196f3",
      //   success: "#4caf50"
      // };
    } else {
      this.$vuetify.theme.themes.light.primary = '#197596';
      this.$vuetify.theme.themes.light.secondary = '#FFFFFF';
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

  protected async mounted() {
    await this.$store.dispatch('loading', true);
    try {
      await MyCatalog.initialize();

      this.$store.dispatch('get');
      this.$store.dispatch('login');
    } finally {
      await this.$store.dispatch('loading', false);
    }
  }

  get searchWord() {
    return this.$store.state.searchWord;
  }

  set searchWord(value: string) {
    clearTimeout(this.triggerSearchTimeout);

    const self = this;
    this.triggerSearchTimeout = setTimeout(function() {
      self.$store.dispatch('search', value.trim());
    }, 500);
  }

}
</script>

<style lang="scss">
.v-toolbar__content .v-toolbar {
  padding-left: 20px;
  padding-right: 20px;
}

.v-toolbar__content {
  padding: 0;
}

.v-input__control {
  min-height: 36px !important;
}
.v-chip {
  margin-left: 0px;
}
.text-nowrap {
  white-space: nowrap;
}
.text-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 200px;
}
.search input {
  caret-color: red;
}
</style>

<style lang="scss" scoped>
#app .v-navigation-drawer__border {
  display: none
}

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
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
}
</style>

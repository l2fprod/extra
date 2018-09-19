<template>
  <div id="app">
    <nav class="navbar is-info">
      <div class="navbar-item">
        extra
      </div>
      <div class="navbar-item" id="search-container">
        <input id="search" class="is-success" type="text" value="search" />
      </div>
      <div class="navbar-item">
        <Avatar :name="store.user.Email" />
      </div>
    </nav>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Avatar from '@/components/Avatar.vue';
import Store from '@/models/Store';

@Component({
  components: {
    Avatar,
  },
})
export default class App extends Vue {
  private store = new Store();
  protected mounted() {
    this.store.login();
  }
}
</script>

<style lang="scss" scoped>
#nav {
  display: flex;
  flex-direction: row;
}

#search-container {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
}

#search {
  flex-grow: 1;
  height: 40px;
  font-size: 20px;
  padding: 6px;
  border: none;
  outline: none;
}

#app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
}
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>

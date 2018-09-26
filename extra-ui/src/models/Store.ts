import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/Api';
import Item from './Item';
import { createItem } from './ItemFactory';

const api = new Api('http://0.0.0.0:32772');

Vue.use(Vuex);

export class State {
  public user: any;
  public resources: Item[] = [];
  public searchWord?: string;
  public filteredResources: Item[] = [];
}

function computeFiltered(resources: Item[], searchWord?: string): Item[] {
  let filteredResources;
  if (searchWord == null || searchWord!.trim().length === 0) {
    filteredResources = resources;
  } else {
    const lower: string = searchWord!.trim().toLowerCase();
    filteredResources = resources.filter((item) =>
      item.name != null && item.name!.toLowerCase().indexOf(lower) >= 0
    );
  }
  return filteredResources;
}

export default new Vuex.Store({
  state: new State(),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setResources(state, resources) {
      state.resources = resources;
      state.filteredResources = computeFiltered(resources, state.searchWord);
    },
    setSearchWord(state, searchWord) {
      state.searchWord = searchWord;
      state.filteredResources = computeFiltered(state.resources, state.searchWord);
    },
  },
  actions: {
    async login(context) {
      context.commit('setUser', (await api.login()).data);
    },
    async search(context, query: string) {
      console.log('set search to', query);
      context.commit('setSearchWord', query);
    },
    async refresh(context) {
      await api.refresh();
      const result = (await api.get()).data;
      const items = result.map((item: any) => createItem(item));
      context.commit('setResources', items);
      console.log(items);
    },
    async get(context) {
      const result = (await api.get()).data;
      const items = result.map((item: any) => createItem(item));
      context.commit('setResources', items);
      console.log(items);
    },
  },
});

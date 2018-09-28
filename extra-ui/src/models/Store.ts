import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/Api';
import { TYPES, createItem } from './ItemFactory';
import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';
import ItemLookup from '@/models/ItemLookup';
import { TextFilter } from '@/models/filters/TextFilter';
import AndFilter from '@/models/filters/AndFilter';

const api = new Api('http://0.0.0.0:32772');

Vue.use(Vuex);

export class State {
  public user: any;
  public resources: Item[] = [];
  public resourcesByType: Map<string, Item[]> = new Map();
  public searchWord: string = '';
  public searchFilter: Filter = new AndFilter([]);
  public filteredResources: Item[] = [];
  public filteredByType: Map<string, Item[]> = new Map();
}

function computeFiltered(state: State) {

  const filter = new AndFilter([ new TextFilter(state.searchWord), state.searchFilter ]);
  const filteredResources = state.resources.filter((item) => filter.accept(item));
  state.filteredResources = filteredResources;

  TYPES.forEach((type) => {
    state.resourcesByType.set(type.id, []);
    state.filteredByType.set(type.id, []);
  });

  state.resources.forEach((item) => {
    try {
      state.resourcesByType.get(item.type!)!.push(item);
    } catch (err) {
      // console.log(`type ${item.type} is not supported!!!`);
    }
  });
  state.filteredResources.forEach((item) => {
    try {
      state.filteredByType.get(item.type!)!.push(item);
    } catch (err) {
      // console.log(`type ${item.type} is not supported!!!`);
    }
  });
}

export default new Vuex.Store({
  state: new State(),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setResources(state, resources: Item[]) {
      // index all resources by crn
      const crnToId: Map<string, Item> = new Map();
      resources.forEach((item) => crnToId.set(item.crn!, item));
      resources.sort((a: Item, b: Item) => a.name!.localeCompare(b.name!));
      state.resources = resources;
      computeFiltered(state);
      const lookup: ItemLookup = {
        getByType: (type: string) => state.resourcesByType.get(type)!,
        findByCrn: (crn: string) => crnToId.get(crn),
      };
      resources.forEach((item) => item.resolveDependencies(lookup));
    },
    setSearchWord(state, searchWord) {
      state.searchWord = searchWord;
      computeFiltered(state);
    },
    setSearchFilter(state, filter) {
      state.searchFilter = filter;
      computeFiltered(state);
    },
  },
  actions: {
    async login(context) {
      context.commit('setUser', (await api.login()).data);
    },
    search(context, query: string) {
      console.log('set search to', query);
      context.commit('setSearchWord', query);
    },
    filter(context, filter: Filter) {
      context.commit('setSearchFilter', filter);
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

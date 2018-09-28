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
  public loading: boolean = false;

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

  const filteredByType: Map<string, Item[]> = new Map();
  TYPES.forEach((type) => {
    filteredByType.set(type.id, []);
  });

  filteredResources.forEach((item) => {
    try {
      filteredByType.get(item.type!)!.push(item);
    } catch (err) {
      // console.log(`type ${item.type} is not supported!!!`);
    }
  });

  state.filteredByType = filteredByType;
  state.filteredResources = filteredResources;
}

export default new Vuex.Store({
  state: new State(),
  getters: {
    filteredResources: (state: State) => (filter: Filter): Item[] => {
      return state.filteredResources.filter((item) => filter.accept(item));
    },
    resourcesByType: (state: State) => (type: string): Item[] | undefined => {
      return state.resourcesByType.get(type);
    },
    organizations: (state: State): Array<string | undefined> => {
      return [...new Set(state.resources
        .filter((item: Item) => item.type === 'cf-organization')
        .map((item: Item) => item.name))];
    },
    regions: (state: State): Array<string | undefined> => {
      return [...new Set(state.resources.map((item: Item) => item.region))]
        .filter((region) => region != null && (region as string).length > 0);
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setResources(state, resources: Item[]) {
      // index all resources by crn
      const crnToId: Map<string, Item> = new Map();
      resources.forEach((item) => crnToId.set(item.crn!, item));
      resources.sort((a: Item, b: Item) => a.name!.localeCompare(b.name!));

      // index resources by their type
      const resourcesByType: Map<string, Item[]> = new Map();
      TYPES.forEach((type) => {
        resourcesByType.set(type.id, []);
      });
      resources.forEach((item) => {
        try {
          resourcesByType.get(item.type!)!.push(item);
        } catch (err) {
          // console.log(`type ${item.type} is not supported!!!`);
        }
      });

      // resolve dependencies
      const lookup: ItemLookup = {
        getByType: (type: string) => resourcesByType.get(type)!,
        findByCrn: (crn: string) => crnToId.get(crn),
      };
      resources.forEach((item) => item.resolveDependencies(lookup));
      state.resourcesByType = resourcesByType;
      state.resources = resources;

      // update the filtered properties
      computeFiltered(state);
    },
    setSearchWord(state, searchWord) {
      state.searchWord = searchWord;
      computeFiltered(state);
    },
    setSearchFilter(state, filter) {
      state.searchFilter = filter;
      computeFiltered(state);
    },
    setLoading(state: State, loading: boolean) {
      console.log('setting loading to', loading);
      state.loading = loading;
    },
  },
  actions: {
    loading(context, loading: boolean) {
      context.commit('setLoading', loading);
    },
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
      await context.dispatch('loading', true);
      try {
        await api.refresh();
        const result = (await api.get()).data;
        const items = result.map((item: any) => createItem(item));
        await context.commit('setResources', items);
        console.log(items);
      } finally {
        await context.dispatch('loading', false);
      }
    },
    async get(context) {
      const result = (await api.get()).data;
      const items = result.map((item: any) => createItem(item));
      context.commit('setResources', items);
      console.log(items);
    },
  },
});

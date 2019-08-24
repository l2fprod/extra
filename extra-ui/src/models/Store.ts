import Vue from 'vue';
import Vuex from 'vuex';
import Api from '@/api/Api';
import { TYPES, createItem } from './ItemFactory';
import Filter from '@/models/filters/Filter';
import Item from '@/models/Item';
import ItemLookup from '@/models/ItemLookup';
import { TextFilter } from '@/models/filters/TextFilter';
import AndFilter from '@/models/filters/AndFilter';
import NotFilter from '@/models/filters/NotFilter';
import OrFilter from '@/models/filters/OrFilter';
import TypeFilter from '@/models/filters/TypeFilter';
import CloudFoundryOrganization from '@/models/CloudFoundryOrganization';

const api = new Api('');

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

function computeGlobal(state: State, resources: Item[]) {
  // index all resources by crn
  const crnToId: Map<string, Item> = new Map();
  resources.forEach((item) => crnToId.set(item.crn!, item));
  resources.sort((a: Item, b: Item) => a.name!.localeCompare(b.name!));

  // index resources
  const resourcesByType: Map<string, Item[]> = new Map();
  TYPES.forEach((type) => {
    resourcesByType.set(type.id, []);
  });
  const resourcesById: Map<string, Item> = new Map();
  resources.forEach((item) => {
    try {
      resourcesByType.get(item.type!)!.push(item);
    } catch (err) {
      // console.log(`type ${item.type} is not supported!!!`);
    }
    resourcesById.set(item.resource_id!, item);
  });

  // resolve dependencies
  const lookup: ItemLookup = {
    getByType: (type: string) => resourcesByType.get(type)!,
    findByCrn: (crn: string) => crnToId.get(crn),
    findByResourceId: (id: string) => resourcesById.get(id),
  };
  resources.forEach((item) => item.resolveDependencies(lookup));
  resources.forEach((item) => item.resolved());

  // keep only the resources we use in the UI
  const uiFilter = new NotFilter(
    new OrFilter([
      new TypeFilter('cf-service-binding'),
      new TypeFilter('resource-alias'),
      new TypeFilter('resource-binding'),
      new TypeFilter('resource-group'),
      new TypeFilter('cf-space'),
      new TypeFilter('cf-organization'),
    ]),
  );
  state.resources = resources.filter((item) => uiFilter.accept(item));
  state.resourcesByType = resourcesByType;
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

const initialState = new State();
computeGlobal(initialState, []);
computeFiltered(initialState);

export default new Vuex.Store({
  state: initialState,
  getters: {
    filteredResources: (state: State) => (filter: Filter): Item[] => {
      return state.filteredResources.filter((item) => filter.accept(item));
    },
    filteredByType: (state: State) => (type: string): Item[] | undefined => {
      return state.filteredByType.get(type);
    },
    resourcesByType: (state: State) => (type: string): Item[] | undefined => {
      return state.resourcesByType.get(type);
    },
    organizations: (state: State): Array<string | undefined> => {
      return [...new Set(state.resourcesByType.get('cf-organization')!
        .map((item: Item) => item.name))];
    },
    spaces: (state: State) => (organization: string): Array<string | undefined> => {
      const orgs: CloudFoundryOrganization[] =
        (state.resourcesByType.get('cf-organization')!
          .filter((item: Item) => item.name === organization) as CloudFoundryOrganization[]);
      let allSpaces: string[] = [];
      orgs.forEach((org) => {
        allSpaces = allSpaces.concat(org.__spaces.map((space) => space.name!));
      });
      return [...new Set(allSpaces)];
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
    async setResources(state, resources: Item[]) {
      computeGlobal(state, resources);

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
      } finally {
        await context.dispatch('loading', false);
      }
    },
    async get(context) {
      await context.dispatch('loading', true);
      try {
        const result = (await api.get()).data;
        const items = result.map((item: any) => createItem(item));
        context.commit('setResources', items);
      } finally {
        await context.dispatch('loading', false);
      }
    },
  },
});

import locations from './locations-snapshot.json';
import locationMetadata from './locations-metadata.json';

function traverse(node: any, callback: (any)) {
  callback(node);
  if (node.children) {
    node.children.forEach((child: any) => traverse(child, callback));
  }
}

interface LocationMarker {
  latitude: number;
  longitude: number;
}

interface LocationExtension {
  marker: LocationMarker;
}

export interface Location {
  id: string;
  kind: string;
  extension?: LocationExtension;
}

// index locations and augment them for additional metadata
const idToLocation: any = {};
locations.forEach((location: Location) => traverse(location, (node: any) => {
  if (idToLocation[node.id]) {
    console.warn('Found duplication location!', node.id);
  }
  idToLocation[node.id] = node;
  if (locationMetadata[node.id]) {
    node.extension = {};
    Object.keys(locationMetadata[node.id]).forEach((key) => node.extension[key] = locationMetadata[node.id][key]);
  }
}));

// expose regions
const locationsWithCoordinates: Location[] = [];
locations.forEach((location: any) => traverse(location, (node: any) => {
  if (node.extension && node.extension!.marker) {
    locationsWithCoordinates.push(node);
  }
}));

export const Locations = {
  locationsWithCoordinates,
};

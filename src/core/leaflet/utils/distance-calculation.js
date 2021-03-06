import L from 'leaflet';

export const getPointToPointDistances = points => {
  const distances = points.reduce((acc, latlng, index, list) => {
    const prev = list[index - 1] || latlng;
    const start = latlng.distanceTo ? latlng : L.latLng(latlng);
    const next = start.distanceTo(prev);
    return [...acc, next];
  }, []);
  return distances;
};

export const getAccumulatedDistances = points => {
  const distances = getPointToPointDistances(points);
  const accumulated = distances.reduce((acc, value) => {
    const prev = acc[acc.length - 1] || 0;
    const next = value + prev;
    return [...acc, next];
  }, []);
  return accumulated;
};

export const getDistance = (points, polygon) => {
  const [first] = points;
  const pts = polygon ? [...points, first] : points;
  const accumulated = getAccumulatedDistances(pts);
  const last = accumulated.length - 1;
  return accumulated[last];
};

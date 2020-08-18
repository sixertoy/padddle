import 'leaflet-geometryutil';

import { GeometryUtil } from 'leaflet';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getPathPoints } from '../../../../helpers';
import { updateParcours } from '../../../../redux/actions';
import { selectParcours } from '../../../../redux/selectors';

const useMarkerCreator = track => {
  const dispatch = useDispatch();
  const parcours = useSelector(selectParcours);

  const addHandler = useCallback(
    ({ latlng }) => {
      const elt = track.current.leafletElement;
      const latlngs = elt.getLatLngs();
      let pts = getPathPoints(latlngs);
      if (parcours.polygon) pts = [...pts, pts[0]];
      const found = pts.reduce((acc, point, index, list) => {
        if (index === 0) return acc;
        const prev = list[index - 1];
        const belongsTo = GeometryUtil.belongsSegment(latlng, point, prev);
        if (!belongsTo) return acc;
        return index;
      }, -1);
      const end = parcours.points.slice(found);
      const start = parcours.points.slice(0, found);
      const next = [...start, latlng, ...end];
      dispatch(updateParcours({ ...parcours, points: next }));
    },
    [parcours, dispatch, track]
  );

  return {
    addHandler,
  };
};

export default useMarkerCreator;

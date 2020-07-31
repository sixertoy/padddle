import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { LayerGroup, Marker, Polygon, Polyline } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { commitDraft } from '../../redux/actions';
import { DotMarker } from './markers';
import Popup from './popup';

const DraftComponent = ({ data }) => {
  const dispatch = useDispatch();
  const user = useSelector(_ => _.user);

  const hasPoints = data.points && data.points.length >= 1;
  const [firstMarker] = (hasPoints && data.points.slice(0, 1)) || null;
  const others = (hasPoints && data.points.slice(1)) || [];

  const firstClickHandler = useCallback(() => {
    const { uid } = user;
    const canCommitPolygon = data.points.length >= 3;
    if (!canCommitPolygon) return;
    dispatch(commitDraft({ ...data, polygon: true, uid }));
  }, [data, dispatch, user]);

  return (
    <LayerGroup>
      {(data.polygon && (
        <Polygon color={data.color} positions={data.points} />
      )) || <Polyline color={data.color} positions={data.points} />}
      <LayerGroup>
        {firstMarker && (
          <Marker
            key={`${firstMarker.lat},${firstMarker.lng}`}
            draggable
            icon={DotMarker(data.color)}
            position={firstMarker}
            onClick={firstClickHandler}
          />
        )}
        {others.map(obj => (
          <Marker
            key={`${obj.lat},${obj.lng}`}
            draggable
            icon={DotMarker(data.color)}
            position={obj}
          />
        ))}
      </LayerGroup>
      <Popup isDraft data={data} />
    </LayerGroup>
  );
};

DraftComponent.propTypes = {
  data: PropTypes.shape({
    color: PropTypes.string,
    points: PropTypes.arrayOf(
      PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      })
    ),
    polygon: PropTypes.bool,
  }).isRequired,
};

export default DraftComponent;

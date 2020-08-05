import PropTypes from 'prop-types';
import React, { useCallback, useRef } from 'react';
import { LayerGroup, Marker, Polygon, Polyline } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';

import { noop, rgba } from '../../../core';
import { closePopup, openPopup, updateParcours } from '../../../redux/actions';
import { DotMarker, StartMarker } from '../icons';
import Tooltip from './tooltip';

const ParcoursComponent = ({ data }) => {
  const polygon = useRef();
  const dispatch = useDispatch();

  const user = useSelector(_ => _.user);
  const selected = useSelector(_ => _.selected);
  const createmode = useSelector(_ => _.createmode);

  const [startpoint, ...waypoints] = data.points;

  const isconnected = user && user.uid;
  const isowner = data.user === user.uid;
  const isselected = selected === data.id;

  const showwaypoints = isconnected && isselected;

  const selectmode = selected && !isselected;
  const opacity = selectmode || createmode ? 0.25 : 1;
  const showtooltip = !selected && !createmode;
  const showmarker = !createmode && !selectmode && startpoint;

  const clickHandler = useCallback(() => {
    if (createmode) return;
    if (isselected) dispatch(closePopup());
    if (!isselected) dispatch(openPopup(data.id));
  }, [createmode, data, dispatch, isselected]);

  const dragHandler = useCallback(
    (index, latlng) => {
      const points = data.points.map((obj, i) => {
        if (index !== i) return obj;
        return latlng;
      });
      const elt = polygon.current.leafletElement;
      elt.setLatLngs(points);
    },
    [data.points]
  );

  const dragendHandler = useCallback(() => {
    const elt = polygon.current.leafletElement;
    let points = elt.getLatLngs();
    // @NOTE Leaflet.Polygon renvoi un array imbriqué
    if (data.polygon) [points] = points;
    dispatch(updateParcours({ ...data, points }));
  }, [data, dispatch]);

  return (
    <LayerGroup>
      <React.Fragment>
        {(data.polygon && (
          <Polygon
            ref={polygon}
            interactive
            color={rgba(data.color, opacity)}
            fill={rgba(data.color, opacity)}
            positions={data.points}
            onClick={clickHandler}>
            {showtooltip && <Tooltip data={data} />}
          </Polygon>
        )) || (
          <Polyline
            ref={polygon}
            interactive
            color={rgba(data.color, opacity)}
            positions={data.points}
            onClick={clickHandler}>
            {showtooltip && <Tooltip data={data} />}
          </Polyline>
        )}
      </React.Fragment>
      <LayerGroup>
        {showmarker && (
          <Marker
            key={`${startpoint.lat},${startpoint.lng}`}
            draggable={isconnected}
            icon={StartMarker(data.color)}
            position={startpoint}
            onClick={isowner ? clickHandler : noop}
            onDrag={({ latlng }) => dragHandler(0, latlng)}
            onDragEnd={dragendHandler}>
            {showtooltip && <Tooltip data={data} />}
          </Marker>
        )}
        {showwaypoints &&
          waypoints.map((obj, index) => (
            <Marker
              key={`${obj.lat},${obj.lng}`}
              draggable
              icon={DotMarker(data.color)}
              position={obj}
              onClick={isowner ? clickHandler : noop}
              onDrag={({ latlng }) => dragHandler(index + 1, latlng)}
              onDragEnd={dragendHandler}
            />
          ))}
      </LayerGroup>
    </LayerGroup>
  );
};

ParcoursComponent.propTypes = {
  data: PropTypes.shape({
    color: PropTypes.string,
    distance: PropTypes.number,
    id: PropTypes.string,
    name: PropTypes.string,
    points: PropTypes.arrayOf(PropTypes.shape()),
    polygon: PropTypes.bool,
    user: PropTypes.string,
  }).isRequired,
};

export default ParcoursComponent;

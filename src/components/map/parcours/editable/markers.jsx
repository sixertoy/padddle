import PropTypes from 'prop-types';
import React from 'react';
import { LayerGroup, Marker } from 'react-leaflet';

import { DraggableMarker, TrackEndMarker, TrackStartMarker } from '../../icons';
import { EditTooltip } from '../../tooltips';
import useDraggable from './use-draggable';

const DraggableMarkersComponent = ({ refs }) => {
  const {
    dragEndHandler,
    dragHandler,
    dragStartHandler,
    isDragging,
    markers,
    removeHandler,
    togglePolygonShape,
  } = useDraggable(refs);

  return (
    <LayerGroup>
      {markers.start && (
        <Marker
          draggable
          bubblingMouseEvents={false}
          icon={TrackStartMarker('#00FF00')}
          position={markers.start}
          onDblClick={togglePolygonShape}
          onDrag={dragHandler(0)}
          onDragEnd={dragEndHandler}
        />
      )}
      <LayerGroup>
        {markers.waypoints.map((point, index) => {
          const key = `${point.lat},${point.lng}`;
          return (
            <Marker
              key={key}
              draggable
              bubblingMouseEvents={false}
              icon={DraggableMarker('#3388FF')}
              position={point}
              onClick={removeHandler(index + 1)}
              onDrag={dragHandler(index + 1)}
              onDragEnd={dragEndHandler}
              onDragStart={dragStartHandler()}>
              {!isDragging && <EditTooltip remove />}
            </Marker>
          );
        })}
      </LayerGroup>
      {markers.end && (
        <Marker
          draggable
          bubblingMouseEvents={false}
          icon={TrackEndMarker('#FF0000')}
          position={markers.end}
          onDrag={dragHandler(markers.length - 1)}
          onDragEnd={dragEndHandler}
        />
      )}
    </LayerGroup>
  );
};

DraggableMarkersComponent.propTypes = {
  refs: PropTypes.shape({ shape: PropTypes.shape(), track: PropTypes.shape() })
    .isRequired,
};

export default DraggableMarkersComponent;

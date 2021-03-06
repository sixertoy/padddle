import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { LayerGroup, Map, Marker, TileLayer } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useHistory } from 'react-router-dom';

import { version } from '../../../package.json';
import { ZINDEX } from '../../constants';
import {
  addPointDraft,
  closeSelected,
  updateAppReadyState,
} from '../../redux/actions';
import { selectAllTracks } from '../../redux/selectors';
import Controls from './controls';
import Draft from './draft';
import { UserPositionMarker } from './icons';
import Parcours from './parcours';

// const SATELLITE_LAYER = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
const OSM_LAYER = 'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
const ESRI_LAYER =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const useStyles = createUseStyles({
  container: {
    bottom: 0,
    composes: ['is-absolute'],
    left: 0,
    right: 0,
    top: 60,
    zIndex: ZINDEX.MAP,
  },
});

const GeoMap = ({ config }) => {
  const map = useRef(null);
  const timer = useRef(null);
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 680px)' });

  const parcours = useSelector(selectAllTracks);
  const editmode = useSelector(_ => _.editmode);
  const createmode = useSelector(_ => _.createmode);
  const userposition = useSelector(_ => _.userposition);

  const [satellite, setSatellite] = useState(false);

  const mapReadyHandler = useCallback(() => {
    dispatch(updateAppReadyState({ map: true }));
  }, [dispatch]);

  const satelliteClickHandler = useCallback(show => {
    setSatellite(show);
  }, []);

  const mapClickHandler = useCallback(
    evt => {
      // @TODO add debugger
      if (editmode) return;
      const { latlng } = evt;
      if (createmode) {
        dispatch(addPointDraft(latlng));
      } else {
        dispatch(closeSelected(latlng));
      }
    },
    [createmode, dispatch, editmode]
  );

  const viewportChangedHandler = useCallback(
    ({ center, zoom }) => {
      if (editmode || !center) return;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        () => history.push(`/${center.join(',')},${zoom}`),
        500
      );
    },
    [editmode, history]
  );

  useEffect(() => {
    const lmap = map.current.leafletElement;
    const center = lmap.getCenter();
    const shouldRelocate =
      userposition &&
      userposition.lat !== center.lat &&
      userposition.lng !== center.lng;
    if (shouldRelocate) {
      lmap.setView(userposition);
    }
  }, [userposition]);

  const attribution = satellite
    ? `ESRI | Padddle.io v${version}`
    : `OSM | Padddle.io v${version}`;

  return (
    <div className={classes.container}>
      <Map
        ref={map}
        attributionControl={!isMobile}
        center={config.center}
        doubleClickZoom={!editmode && !createmode}
        maxZoom={17}
        minZoom={1}
        whenReady={mapReadyHandler}
        zoom={config.zoom}
        zoomControl={false}
        onClick={mapClickHandler}
        onViewportChanged={viewportChangedHandler}>
        <TileLayer
          attribution={attribution}
          url={(!satellite && OSM_LAYER) || ESRI_LAYER}
        />
        <Controls onChange={satelliteClickHandler} />
        <LayerGroup>
          {parcours.map(item => (
            <Parcours key={item.id} data={item} />
          ))}
          {createmode && <Draft />}
        </LayerGroup>
        {userposition && (
          <Marker
            draggable={false}
            icon={UserPositionMarker}
            position={userposition}
          />
        )}
      </Map>
    </div>
  );
};

GeoMap.propTypes = {
  config: PropTypes.shape().isRequired,
};

export default GeoMap;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';

import { db } from '../core/firebase';
import { appLoaded, loadedParcours, openSelected } from '../redux/actions';

const SharePageComponent = function SharePageComponent() {
  const dispatch = useDispatch();

  const { id } = useParams();

  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [redirectTo, setRedirectTo] = useState(null);

  const parcours = useSelector(_ => _.parcours);

  useEffect(() => {
    if (!loaded && !mounted && id) {
      setMounted(true);
      db.all('parcours').then(results => {
        dispatch(loadedParcours(results));
        dispatch(appLoaded());
        dispatch(openSelected(id));
        setLoaded(true);
      });
    }
  }, [dispatch, id, loaded, mounted]);

  useEffect(() => {
    if (loaded) {
      const { coordinates } = parcours.find(obj => obj.id === id);
      const next = `/${coordinates.lat},${coordinates.lng},12`;
      setRedirectTo(next);
    }
  }, [id, loaded, parcours]);

  return (
    <div id="application-page">
      {redirectTo && <Redirect to={redirectTo} />}
    </div>
  );
};

export default SharePageComponent;

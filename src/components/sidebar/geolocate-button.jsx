import Tippy from '@tippyjs/react';
import classnames from 'classnames';
import React, { useCallback, useState } from 'react';
import { IoIosSync as Loader, IoMdLocate as TargetIcon } from 'react-icons/io';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';

import { geolocateMe } from '../../core';
import { setUserPosition } from '../../redux/actions';

const useStyles = createUseStyles({
  button: {
    '&:hover': {
      background: '#FF5850',
      color: '#FFFFFF',
    },
    background: '#FFFFFF',
    borderRadius: '50%',
    composes: ['fs18'],
    height: 40,
    lineHeight: 0,
    marginBottom: 7,
    outline: 'none',
    transition: 'all 0.3s',
    width: 40,
  },
  [`@media (max-width: ${680}px)`]: {
    button: {
      fontSize: '16px !important',
      height: 35,
      width: 35,
    },
  },
});

const GeolocateButton = function GeolocateButton() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const editmode = useSelector(_ => _.editmode);
  const createmode = useSelector(_ => _.createmode);

  const [loading, setLoading] = useState(false);

  const clickHandler = useCallback(() => {
    setLoading(true);
    geolocateMe().then(({ point }) => {
      setLoading(false);
      dispatch(setUserPosition(point));
    });
  }, [dispatch]);

  return (
    <Tippy content="Ma position" placement="left">
      <button
        className={classnames(classes.button, { createmode, loading })}
        disabled={loading || createmode || editmode}
        type="button"
        onClick={clickHandler}>
        {!loading && <TargetIcon className="icon" />}
        {loading && <Loader className="loader" />}
      </button>
    </Tippy>
  );
};

export default GeolocateButton;

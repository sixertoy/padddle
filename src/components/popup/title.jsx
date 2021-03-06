import classnames from 'classnames';
import get from 'lodash.get';
import React, { useCallback, useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';

import { KEY_CODE_ENTER } from '../../constants';
import { noop } from '../../core';
import { FirebaseAuthConsumer } from '../../core/firebase';
import { isOwner } from '../../helpers';
import { updateDraft, updateParcours } from '../../redux/actions';
import { selectParcours } from '../../redux/selectors';

const useStyles = createUseStyles({
  container: {
    composes: ['mx7'],
    flex: 1,
  },
  title: {
    '&:not(.readonly):focus': {
      background: 'rgba(0, 0, 0, 0.07)',
      padding: 12,
    },
    borderRadius: 8,
    color: 'rgba(0, 0, 0, 0.85)',
    composes: ['fs24', 'text-center', 'is-light'],
    minWidth: 100,
    padding: 7,
    textOverflow: 'ellipsis',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
    width: '100%',
  },
  [`@media (max-width: ${680}px)`]: {
    title: {
      background: 'transparent !important',
      borderRadius: '0 !important',
      fontSize: 18,
      padding: '7px !important',
    },
  },
  [`@media (max-width: ${320}px)`]: {
    title: {
      fontSize: 16,
    },
  },
});

const TitleComponent = function TitleComponent() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [content, setContent] = useState('');

  const parcours = useSelector(selectParcours);
  const createmode = useSelector(_ => _.createmode);
  const name = get(parcours, 'name', '');

  const blurHandler = useCallback(
    evt => {
      evt.preventDefault();
      const update = evt.target.value;
      const empty = !update || update.trim() === '';
      if (empty) return;
      const next = { ...parcours, name: update.trim() };
      const action = createmode ? updateDraft : updateParcours;
      dispatch(action(next));
    },
    [createmode, dispatch, parcours]
  );

  const keydownHandler = useCallback(
    evt => {
      const code = evt.keyCode;
      const isEnterKey = code === KEY_CODE_ENTER;
      if (!isEnterKey) return;
      const update = evt.target.value;
      const empty = !update || update.trim() === '';
      if (empty) return;
      const next = { ...parcours, name: update.trim() };
      const action = createmode ? updateDraft : updateParcours;
      dispatch(action(next));
      evt.target.blur();
    },
    [createmode, dispatch, parcours]
  );

  const nameHandler = useCallback(evt => {
    evt.preventDefault();
    const update = evt.target.value;
    setContent(update);
  }, []);

  useEffect(() => {
    setContent(name);
  }, [name]);

  return (
    <FirebaseAuthConsumer>
      {({ user }) => {
        const readonly = !isOwner(parcours, user);
        return (
          <div className={classes.container}>
            <input
              className={classnames(classes.title, { readonly })}
              readOnly={readonly}
              type="text"
              value={content}
              onBlur={!readonly ? blurHandler : noop}
              onChange={nameHandler}
              onKeyDown={keydownHandler}
            />
          </div>
        );
      }}
    </FirebaseAuthConsumer>
  );
};

export default TitleComponent;

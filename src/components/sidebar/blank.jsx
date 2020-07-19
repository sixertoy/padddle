import React, { useCallback } from 'react';
import {
  AiOutlinePlus as PlusIcon,
  AiTwotoneSave as SaveIcon,
} from 'react-icons/ai';
import { createUseStyles } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';

import { commitParcours, createParcours } from '../../redux/actions';
import { selectDraft, selectEditMode } from '../../redux/selectors';

const useStyles = createUseStyles({
  container: {},
});

const BlankComponent = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const draft = useSelector(selectDraft);
  const editmode = useSelector(selectEditMode);

  const onclick = useCallback(() => {
    if (editmode) {
      dispatch(commitParcours(draft));
    } else {
      dispatch(createParcours());
    }
  }, [dispatch, draft, editmode]);

  return (
    <div className={classes.container}>
      <button type="button" onClick={onclick}>
        {!editmode && <PlusIcon />}
        {editmode && <SaveIcon />}
      </button>
    </div>
  );
};

BlankComponent.defaultProps = {};

BlankComponent.propTypes = {};

export default BlankComponent;

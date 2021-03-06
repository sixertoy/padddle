import Tippy from '@tippyjs/react';
import React, { useCallback } from 'react';
import { IoMdTrash as DeleteIcon } from 'react-icons/io';
import { createUseStyles } from 'react-jss';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { openDeleteModal } from '../../../redux/actions';

const useStyles = createUseStyles({
  button: {
    '&:hover': {
      background: '#B13333',
    },
    background: '#FF5950',
    borderRadius: '50%',
    color: '#FFFFFF',
    composes: ['fs18'],
    height: 40,
    lineHeight: 0,
    outline: 'none',
    transition: 'all 0.3s',
    width: 40,
  },
  [`@media (max-width: ${680}px)`]: {
    button: {
      marginLeft: '0 !important',
    },
  },
});

const DeleteButtonComponent = function DeleteButtonComponent() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery({ query: '(max-width: 680px)' });

  const deleteHandler = useCallback(() => {
    dispatch(openDeleteModal());
  }, [dispatch]);

  return (
    <Tippy content="Supprimer" placement="left" touch={!isMobile}>
      <button className={classes.button} type="button" onClick={deleteHandler}>
        <DeleteIcon />
      </button>
    </Tippy>
  );
};

export default DeleteButtonComponent;

import get from 'lodash.get';
import PropTypes from 'prop-types';
import React from 'react';
import { createUseStyles } from 'react-jss';

import AccountPopin from '../account-popin';
import Tooltip from '../commons/tooltip';

const useStyles = createUseStyles({
  button: {
    '& .icon': {
      color: '#E61E4D',
      marginLeft: 8,
      marginRight: 8,
    },
    '& img': {
      borderRadius: '50%',
      composes: ['is-block'],
      height: 32,
      marginLeft: 8,
      width: 32,
    },
    border: '1px solid #EDEDED',
    borderRadius: 20,
    composes: [
      'is-block',
      'fs16',
      'p5',
      'no-overflow',
      'flex-columns',
      'items-center',
    ],
    height: 42,
    paddingLeft: '16px !important',
  },
  name: {
    fontSize: '0.8em',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  tooltip: {
    '& .tippy-content': {
      border: '0 !important',
      padding: '0 !important',
    },
    border: '0 !important',
    padding: '0 !important',
  },
  [`@media (max-width: ${680}px)`]: {
    button: {
      '& img': { marginLeft: 0 },
      background: '#FFFFFF !important',
      display: 'block',
      height: 32,
      padding: '0 !important',
      textAlign: 'center',
      width: 32,
    },
    name: {
      display: 'none',
      visibility: 'hidden',
    },
  },
});

const AvatarComponent = React.memo(function AvatarComponent({ user }) {
  const classes = useStyles();
  const name = get(user, 'displayName', null);
  const photoURL = get(user, 'photoURL', null);
  return (
    <Tooltip
      hideOnClick
      arrow={false}
      className={classes.tooltip}
      component={<AccountPopin />}
      offset={[0, 12]}
      placement="bottom-end"
      theme="light"
      useHover={false}>
      <button className={classes.button} type="button">
        <span className={classes.name}>{name}</span>
        <img alt="user avatar" src={photoURL} />
      </button>
    </Tooltip>
  );
});

AvatarComponent.propTypes = {
  user: PropTypes.shape().isRequired,
};

export default AvatarComponent;

import PropTypes from 'prop-types';
import React from 'react';

import { FirebaseAuthContext, renderWithProps } from '../core';

const IfFirebaseAuthed = React.memo(({ and, children }) => (
  <FirebaseAuthContext.Consumer>
    {state => {
      const { isSignedIn } = state;
      if (!state || !isSignedIn) return null;
      let isvalid = true;
      if (and) isvalid = and(state);
      return isvalid && renderWithProps(children, state);
    }}
  </FirebaseAuthContext.Consumer>
));

IfFirebaseAuthed.defaultProps = {
  and: null,
};

IfFirebaseAuthed.propTypes = {
  and: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType,
    PropTypes.func,
  ]).isRequired,
};

IfFirebaseAuthed.displayName = 'IfFirebaseAuthed';

export default IfFirebaseAuthed;

import storage from 'redux-persist/lib/storage';

// import { version } from '../../package.json';
import { PERSIST_STORAGE_KEY } from '../constants';

const INITIAL_REDUCERS = {
  blacklist: {
    createmode: false,
    draft: false,
    modal: false,
    selected: false,
    userposition: false,
  },
  whitelist: {
    parcours: [],
    user: {},
  },
};

export const reduxPersistConfig = {
  blacklist: Object.keys(INITIAL_REDUCERS.blacklist),
  key: PERSIST_STORAGE_KEY,
  storage,
  whitelist: Object.keys(INITIAL_REDUCERS.whitelist),
};

export const getInitialState = () => {
  const { blacklist, whitelist } = INITIAL_REDUCERS;
  const values = { ...whitelist, ...blacklist };
  const initialState = { ...values };
  return initialState;
};

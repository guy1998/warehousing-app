import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import mailReducer from './slices/mail';
import chatReducer from './slices/chat';
import productReducer from './slices/product';
import categoryReducer from './slices/category';
import unitReducer from './slices/unit';
import zoneReducer from './slices/zone';
import calendarReducer from './slices/calendar';
import kanbanReducer from './slices/kanban';

// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const categoryPersistConfig = {
  key: 'category',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const unitPersistConfig = {
  key: 'unit',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const zonePersistConfig = {
  key: 'zone',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  product: persistReducer(productPersistConfig, productReducer),
  category: persistReducer(categoryPersistConfig, categoryReducer),
  unit: persistReducer(unitPersistConfig, unitReducer),
  zone: persistReducer(zonePersistConfig, zoneReducer),
});

export { rootPersistConfig, rootReducer };

import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducers";
import rootSaga from './sagas/rootSaga';

const composeEnhancers =
	typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				// Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
		  })
		: compose;

export const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const middlewares = [sagaMiddleware];
	const persistedReducer = persistReducer(
		{
			key: 'myconfident',
			storage,
			whitelist: ["auth"],
		},
		rootReducer,
		window.__REDUX_DEVTOOLS_EXTENSION__ &&
			window.__REDUX_DEVTOOLS_EXTENSION__()
	);

	const store = createStore(
		persistedReducer,
		composeEnhancers(applyMiddleware(...middlewares))
	);

	const persistor = persistStore(store);
	sagaMiddleware.run(rootSaga);

	return { store, persistor };
};

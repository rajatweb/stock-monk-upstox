import { configureStore } from "@reduxjs/toolkit";
import { userApi } from "./api/user-api";
import { userReducer } from "./slice/user-slice";
import { socketApi } from "./api/socket-api";
import { optionChainApi } from "./api/option-chain";
import { historicalDataApi } from "./api/historical-data";
import { marketInfoApi } from "./api/market-info";
import { socketReducer } from "./slice/socket-slice";

export const store = () =>
    configureStore({
        reducer: {
            [userApi.reducerPath]: userApi.reducer,
            [socketApi.reducerPath]: socketApi.reducer,
            [optionChainApi.reducerPath]: optionChainApi.reducer,
            [historicalDataApi.reducerPath]: historicalDataApi.reducer,
            [marketInfoApi.reducerPath]: marketInfoApi.reducer,
            userData: userReducer,
            socketRealTimeData: socketReducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat([
                userApi.middleware,
                socketApi.middleware,
                optionChainApi.middleware,
                historicalDataApi.middleware,
                marketInfoApi.middleware
            ])
    });

export type AppStore = ReturnType<typeof store>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

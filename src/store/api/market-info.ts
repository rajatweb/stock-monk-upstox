import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
const baseUrl = `${process.env.NEXT_PUBLIC_APP_UPSTOX_API_URL}`;

export const marketInfoApi = createApi({
    reducerPath: 'marketInfo',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).userData.access_token

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
                headers.set('Accept', `application/json`);
            }

            return headers
        },
    }),
    tagTypes: ["marketInfo"],
    endpoints: (builder) => ({
        getIndexList: builder.mutation<any, any>({
            query: ({ token }) => {
                return {
                    url: "/option/contract",
                    method: "POST",
                    body: ``
                }
            }
        }),
        getSocketUri: builder.query<any, void>({
            query: () => "/feed/market-data-feed/authorize",
        })
    }),
});

export const { useGetIndexListMutation, useLazyGetSocketUriQuery } = marketInfoApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = `${process.env.NEXT_PUBLIC_APP_UPSTOX_API_URL}`;

export const historicalDataApi = createApi({
    reducerPath: 'historicalData',
    baseQuery: fetchBaseQuery({ baseUrl }),
    tagTypes: ["historicalData"],
    endpoints: (builder) => ({
        getHistoricalData: builder.query<any, any>({
            query: (payload) => {
                const { instrument_key, interval } = payload
                return {
                    url: `/historical-candle/intraday/NSE_INDEX|Nifty Bank/1minute`,
                    params: payload
                }
            },
            providesTags: ["historicalData"]
        }),
        getHistoricalTimeData: builder.query<any, any>({
            query: (payload) => {
                const { instrument_key, interval } = payload
                return {
                    url: `/historical-candle/NSE_INDEX|Nifty Bank/1minute/2024-08-12/2024-08-08`,
                    params: payload
                }
            },
            providesTags: ["historicalData"]
        })
    }),
});

export const { useGetHistoricalDataQuery, useGetHistoricalTimeDataQuery } = historicalDataApi;

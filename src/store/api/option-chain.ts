import { getAppLocalStorageByName } from "@/lib/utils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from '../store';
const baseUrl = `${process.env.NEXT_PUBLIC_APP_UPSTOX_API_URL}`;


export const optionChainApi = createApi({
    reducerPath: 'optionsChain',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const state = getState() as RootState;
            headers.set("Authorization", `Bearer ${state.userData.access_token}`)
            headers.set('Accept', 'application/json')
            return headers
        }
    }),
    tagTypes: ["optionschain"],
    endpoints: (builder) => ({
        getOptionChain: builder.query<any, any>({
            query: (payload) => {
                return {
                    url: "/option/chain",
                    params: payload
                }
            },
            providesTags: ["optionschain"]
        })
    }),
});

export const { useGetOptionChainQuery } = optionChainApi;

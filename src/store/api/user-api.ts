import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IUserTokenRequest, IUserTokenResponse } from "@/types/api/login";
const baseUrl = `${process.env.NEXT_PUBLIC_APP_UPSTOX_API_URL}`;


export const userApi = createApi({
    reducerPath: 'user',
    baseQuery: fetchBaseQuery({ 
        baseUrl,
        prepareHeaders: (headers, { getState }) => {
            headers.set('Accept', 'application/json'),
            headers.set('Content-Type', 'application/x-www-form-urlencoded')
            return headers
        }
    }),
    tagTypes: ["user"],
    endpoints: (builder) => ({
        getUserToken: builder.mutation<IUserTokenResponse, IUserTokenRequest>({
            query: (payload: any) => {
                return {
                    url: "/login/authorization/token",
                    method: "POST",
                    body: new URLSearchParams(payload)
                }
            }
        })
    }),
});

export const { useGetUserTokenMutation } = userApi;

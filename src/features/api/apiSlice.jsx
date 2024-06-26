import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
    reducerPath: 'auth',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
    tagTypes: ['Post', 'User'],
    endpoints: builder => ({})
})


/*
    This is the basic structure we follow to create a apiSlice which we have also seen in RTK Query basics folder.
    The only differnence is that we have not defined endpoints here. We will define them in file where we need them under name extendedApiSlice.
*/ 
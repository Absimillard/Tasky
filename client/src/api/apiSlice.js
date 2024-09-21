import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../slices/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOpts) => {
    let res = await baseQuery(args, api, extraOpts)

    if(res?.error?.originalStatus === 403) {
        const refreshResult = await baseQuery('/check-auth', api, extraOpts)
        console.log(refreshResult)
        if (refreshResult?.data) {
            const user = api.getState().auth.user
            api.dispatch(setCredentials({...refreshResult.data, user}))
            res = await baseQuery(args, api, extraOpts)
        } else {
            api.dispatch(logOut())
        }
    }
    return res
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})

})
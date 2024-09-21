import { createApi } from '@reduxjs/toolkit/query/react';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { setCredentials, logout } from '../authSlice';
// Define your base query
const baseQuery = fetchBaseQuery({ 
  baseUrl: 'http://localhost:3000/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if(token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  } });

  const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    
    if (result?.error?.originalStatus === 403 || result?.error?.originalStatus === 401) {
      const refreshResult = await baseQuery('/check-auth', api, extraOptions);
      
      if (refreshResult?.data) {
        const user = api.getState().auth.user;
        api.dispatch(setCredentials({ ...refreshResult?.data, user }));
        result = await baseQuery(args, api, extraOptions);
      } else {
        api.dispatch(logout());
      }
    }
  
    return result;
  };
// Define your RTK Query APIs
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (formData) => ({
        url: 'login',
        method: 'POST',
        body: formData,
      }),
    }),
    logout: builder.mutation({
      query: () => 'logout',
    }),
    checkAuth: builder.query({
      query: () => 'check-auth',
    }),
  }),
});
export const { useLoginMutation, useCheckAuthQuery } = authApi;

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (formData, userId) => ({
        url: `users/${userId}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    createUser: builder.mutation({
      query: (formData) => ({
        url: 'users',
        method: 'POST',
        body: formData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `users/${userId}`,
        method: 'DELETE',
        body: userId,
      }),
    }),
    fetchUser: builder.query({
      query: (userId) => `users/${userId}`,
    }),
    fetchUsers: builder.query({
      query: () => 'users',
    }),
  }),
});

export const { useFetchUsersQuery, useFetchUserQuery } = usersApi;

export const projectsApi = createApi({
  reducerPath: 'projectsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    updateProject: builder.mutation({
      query: (formData, projectId) => ({
        url: `projects/${projectId}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    createProject: builder.mutation({
      query: (formData) => ({
        url: 'projects',
        method: 'POST',
        body: formData,
      }),
    }),
    uploadFiles: builder.mutation({
      query: ({ title, files }) => {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });
        return {
          url: `upload`,
          method: 'POST',
          body: formData,
          headers: {
            'X-path': `projects/${title}/brief`,
          },
        };
      },
    }),
    deleteProject: builder.mutation({
      query: (projectId) => ({
        url: `projects/${projectId}`,
        method: 'DELETE',
        body: projectId,
      }),
    }),
    fetchProject: builder.query({
      query: (projectId) => `projects/${projectId}`,
    }),
    fetchProjects: builder.query({
      query: () => 'projects',
    }),
    fetchUserProjects: builder.query({
      query: (userId) => `projects/user/${userId}`,
    }),
  }),
});

export const { useFetchProjectQuery, useFetchProjectsQuery, useFetchUserProjectsQuery, useUpdateProjectMutation, useCreateProjectMutation, useUploadFilesMutation } = projectsApi;

export const notifsApi = createApi({
  reducerPath: 'notifsApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    markAsRead: builder.mutation({
      query: ({userId, notifId}) => {
        console.log("markAsRead Endpoint Called with notifId:", notifId, userId); // Add logging statement
        return {
          url: `notifications/${userId}/${notifId}`,
          method: 'PATCH',
        };
      }
    }),
    markAllAsRead: builder.mutation({
      query: (formData, userId) => ({
        url: `notifications/${userId}`,
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteNotification: builder.mutation({
      query: (userId, notifId) => ({
        url: `notifications/${userId}/${notifId}`,
        method: 'DELETE',
        body: notifId,
      }),
    }),
    fetchNotification: builder.query({
      query: (userId, notifId) => `notifications/${userId}/${notifId}`,
    }),
    fetchNotifications: builder.query({
      query: (userId) => `notifications/${userId}`,
    }),
  }),
});

export const { useFetchNotificationsQuery, useFetchNotificationQuery, useMarkAsReadMutation, useDeleteNotificationMutation} = notifsApi;
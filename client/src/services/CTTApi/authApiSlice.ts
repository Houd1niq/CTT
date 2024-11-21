import {CTTApi} from "./api.ts";

interface LoginDto {
  email: string;
  password: string;
}

export const authApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      // invalidatesTags: ["User"],
    }),

    login: build.mutation<{ accessToken: string }, LoginDto>({
      query: (body) => ({
        url: "auth/signin",
        method: "POST",
        body,
      }),
      // invalidatesTags: ["User"],
    }),
  }),
});

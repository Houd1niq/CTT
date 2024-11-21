import {CTTApi} from "./api.ts";

export const userApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<{ id: number, email: string }, undefined>({
      query: () => ({
        url: "user/info",
      }),
      // invalidatesTags: ["User"],
    }),

  }),
});

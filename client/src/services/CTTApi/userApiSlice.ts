import {CTTApi} from "./api.ts";

export const userApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<{ id: number, email: string } | null, void>({
      query: () => ({
        url: "user/info",
      }),
      providesTags: ["User"]
    }),

  }),
});

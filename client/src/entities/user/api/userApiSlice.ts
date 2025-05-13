import {CTTApi} from "@shared/api/api.ts";
import {UserResponse} from "@entities/user/model/types.ts";

export const userApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<UserResponse | null, void>({
      query: () => ({
        url: "user/info",
      }),
      providesTags: ["User"]
    }),
  }),
});

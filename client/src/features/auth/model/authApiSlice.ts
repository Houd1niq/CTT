import {CTTApi} from "@shared/api/api.ts";
import {LoginDto} from "@features/auth/model/types.ts";

export const authApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<null, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, {dispatch, queryFulfilled}) {
        await queryFulfilled
        dispatch(
          CTTApi.util.resetApiState(),
        )
      }
    }),

    sendCode: build.mutation<any, string>({
      query: (email) => ({
        url: "auth/reset",
        method: "POST",
        body: {email},
      }),
    }),

    confirmEmail: build.mutation<any, { email: string, code: string }>({
      query: (body) => ({
        url: "auth/confirm-reset",
        method: "POST",
        body,
      }),
    }),

    confirmAuth: build.mutation<{ accessToken: string }, { email: string, code: string }>({
      query: (body) => ({
        url: "auth/confirm",
        method: "POST",
        body,
      }),
    }),

    changePassword: build.mutation<any, { email: string, code: string, password: string, confirmPassword: string }>({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),


    login: build.mutation<{ accessToken: string }, LoginDto>({
      query: (body) => ({
        url: "auth/signin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

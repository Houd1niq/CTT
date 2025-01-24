import {CTTApi} from "./api.ts";

interface LoginDto {
  email: string;
  password: string;
}

export const authApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    logout: build.mutation<null, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      // invalidatesTags: ["User"],
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

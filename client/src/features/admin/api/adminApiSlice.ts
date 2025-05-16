import {CTTApi} from "@shared/api/api.ts";
import {UserResponse} from "@entities/user";
import {Role} from "@features/admin/model/types.ts";

interface CreateEmployeeRequest {
  fullName?: string;
  email: string;
  roleId: number;
  instituteId?: number;
}

interface CreateEmployeeResponse {
  user: UserResponse;
  tempPassword: string;
}

export const adminApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UserResponse[], void>({
      query: () => ({
        url: "admin/users",
        method: "GET",
      }),
      providesTags: ["AllUsers"],
    }),

    getRoles: build.query<Role[], void>({
      query: () => ({
        url: "admin/roles",
        method: "GET",
      }),
    }),

    createEmployee: build.mutation<CreateEmployeeResponse, CreateEmployeeRequest>({
      query: (body) => ({
        url: "admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AllUsers"],
    }),
  }),
});

export const {useGetUsersQuery, useGetRolesQuery, useCreateEmployeeMutation} = adminApiSlice;

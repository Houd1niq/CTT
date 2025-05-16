import {UserResponse} from '@entities/user';
import {Role} from '@features/admin/model/types';
import {CTTApi} from "@shared/api/api.ts";

interface CreateEmployeeRequest {
  fullName?: string;
  email: string;
  roleId: number;
  instituteId?: number;
}

interface EditEmployeeRequest {
  id: number;
  email?: string;
  fullName?: string;
  roleId?: number;
  instituteId?: number;
}

interface DeleteEmployeeResponse {
  message: string;
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

    createEmployee: build.mutation<UserResponse, CreateEmployeeRequest>({
      query: (body) => ({
        url: "admin/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AllUsers"],
    }),

    deleteEmployee: build.mutation<DeleteEmployeeResponse, number>({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AllUsers"],
    }),

    editEmployee: build.mutation<UserResponse, EditEmployeeRequest>({
      query: (body) => ({
        url: `admin/users/${body.id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["AllUsers", "User"],
    })
  }),
});

export const {
  useGetUsersQuery,
  useGetRolesQuery,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
} = adminApiSlice;

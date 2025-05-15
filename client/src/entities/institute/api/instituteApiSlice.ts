import {CTTApi} from "@shared/api/api.ts";
import {Institute} from "../model/types.ts";

export const instituteApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getInstitutes: build.query<Institute[], any>({
      query: () => ({
        url: "institute",
        method: "GET",
      }),
      providesTags: ["Institutes"]
    }),

    getDeletableInstitutes: build.query<Institute[], void>({
      query: () => ({
        url: "institute/deletable",
        method: "GET",
      }),
      providesTags: ["Institutes", "Patents"]
    }),

    addInstitute: build.mutation<any, { name: string }>({
      query: (body) => ({
        url: `institute`,
        method: "POST",
        body
      }),
      invalidatesTags: ["Institutes"]
    }),

    editInstitute: build.mutation<any, { name: string; id: number }>({
      query: ({id, name}) => ({
        url: `institute/${id}`,
        method: "PATCH",
        body: {name}
      }),
      invalidatesTags: ["Institutes", "Patents"]
    }),

    deleteInstitute: build.mutation<any, number>({
      query: (id) => ({
        url: `institute/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Institutes"]
    }),
  }),
});

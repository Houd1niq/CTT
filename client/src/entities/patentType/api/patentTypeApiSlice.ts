import {CTTApi} from "@shared/api/api.ts";
import {PatentType} from "../model/types.ts";

export const patentTypeApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getPatentTypes: build.query<PatentType[], any>({
      query: () => ({
        url: "patent-type",
        method: "GET",
      }),
      providesTags: ["PatentTypes"]
    }),

    getDeletablePatentTypes: build.query<PatentType[], void>({
      query: () => ({
        url: "patent-type/deletable",
        method: "GET",
      }),
      providesTags: ["PatentTypes", "Patents"]
    }),

    addPatentType: build.mutation<any, { name: string }>({
      query: (body) => ({
          url: `patent-type`,
          method: "POST",
          body
        }
      ),
      invalidatesTags: ['PatentTypes']
    }),

    editPatentType: build.mutation<any, { name: string; id: number }>({
      query: ({id, name}) => ({
          url: `patent-type/${id}`,
          method: "PATCH",
          body: {name}
        }
      ),
      invalidatesTags: ["Patents", "PatentTypes"]
    }),

    deletePatentType: build.mutation<any, number>({
      query: (id) => ({
          url: `patent-type/${id}`,
          method: "DELETE",
        }
      ),
      invalidatesTags: ["PatentTypes"]
    }),
  }),
});

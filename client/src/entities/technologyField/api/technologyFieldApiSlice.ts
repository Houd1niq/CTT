import {CTTApi} from "@shared/api/api.ts";
import {TechnologyField} from "../model/types.ts";

export const technologyFieldApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getTechnologyFields: build.query<TechnologyField[], any>({
      query: () => ({
        url: "technology-field",
        method: "GET",
      }),
      providesTags: ['TechnologyFields']
    }),

    getDeletableTechnologyFields: build.query<TechnologyField[], void>({
      query: () => ({
        url: "technology-field/deletable",
        method: "GET",
      }),
      providesTags: ["TechnologyFields", "Patents"]
    }),

    editTechnologyField: build.mutation<any, { name: string; id: number }>({
      query: ({id, name}) => ({
          url: `technology-field/${id}`,
          method: "PATCH",
          body: {name}
        }
      ),
      invalidatesTags: ["Patents", "TechnologyFields"]
    }),

    deleteTechnologyField: build.mutation<any, number>({
      query: (id) => ({
          url: `technology-field/${id}`,
          method: "DELETE",
        }
      ),
      invalidatesTags: ["TechnologyFields"]
    }),

    addTechnologyField: build.mutation<any, { name: string }>({
      query: (body) => ({
          url: `technology-field`,
          method: "POST",
          body
        }
      ),
      invalidatesTags: ['TechnologyFields']
    }),
  }),
});

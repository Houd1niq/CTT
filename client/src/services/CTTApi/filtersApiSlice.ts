import {CTTApi} from "./api.ts";

export interface FilterType {
  id: number,
  name: string
}

export const filtersApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getTechnologyFields: build.query<FilterType[], any>({
      query: () => ({
        url: "technology-field",
        method: "GET",
      }),
      providesTags: ['TechnologyFields']
    }),

    getDeletableTechnologyFields: build.query<FilterType[], void>({
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

    getPatentTypes: build.query<FilterType[], any>({
      query: () => ({
        url: "patent-type",
        method: "GET",
      }),
      providesTags: ["PatentTypes"]
    }),

    getDeletablePatentTypes: build.query<FilterType[], void>({
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

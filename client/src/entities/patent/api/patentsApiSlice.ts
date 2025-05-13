import {CTTApi} from "@shared/api/api.ts";
import {Patent, PatentsBody, PatentsSearchBody} from "@entities/patent/model/types.ts";
import {concatUrlWithQueryParams} from '@shared/utils/strings.ts'

export const patentsApiSlice = CTTApi.injectEndpoints({
  endpoints: (build) => ({
    getFile: build.query<any, string>({
      query: (patentLink) => ({
        url: `files/${patentLink}`,
        method: "GET",
        //headers for pdf
        headers: {
          "Accept": "application/octet-stream",
          // 'Content-Type': 'application/pdf',
        },
      }),
    }),

    createPatent: build.mutation<Patent, FormData>({
      query: (body) => ({
        url: "patent",
        method: "POST",
        body
      }),
      invalidatesTags: ["Patents"],
    }),

    editPatent: build.mutation<Patent, { data: Record<string, string>, id: number }>({
      query: ({data, id}) => ({
        url: "patent/" + id,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["Patents"],
    }),

    deletePatent: build.mutation<void, string>({
      query: (patentNumber) => ({
        url: `patent/${patentNumber}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patents"],
    }),

    searchPatents: build.query<Patent[], PatentsSearchBody>({
      query: (body) => ({
        // @ts-ignore
        url: concatUrlWithQueryParams("patent/search", body),
        method: "GET",
      }),
      providesTags: ["Patents"],
    }),

    getPatents: build.query<{ patents: Patent[], totalPages: number }, PatentsBody>({
      query: (body) => ({
        // @ts-ignore
        url: concatUrlWithQueryParams("patent", body),
        method: "GET",
      }),
      providesTags: ["Patents"],
    }),
  }),
});

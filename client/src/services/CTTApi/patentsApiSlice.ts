import {CTTApi} from "./api.ts";

export interface Patent {
  id: number,
  createdAt: string,
  patentNumber: string,
  name: string,
  dateOfRegistration: string,
  dateOfExpiration: string,
  contact: string,
  isPrivate: boolean,
  patentLink: string,
  patentType: {
    id: number,
    name: string
  },
  technologyField: {
    id: number,
    name: string
  }
}

interface PatentsBody {
  page?: number,
  sort?: string,
  technologyFieldId?: number[],
  patentTypeId?: number[],
}

interface PantentsSearchBody extends Omit<PatentsBody, 'page'> {
  query: string
}

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

    searchPatents: build.query<Patent[], PantentsSearchBody>({
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

function concatUrlWithQueryParams(url: string, queryParams: Record<string, number | string | number[]>) {
  let paramsString = Object.keys(queryParams).reduce<string>((acc, key) => {
    const value = queryParams[key];

    if ((Array.isArray(value) && !value.length) || !value) {
      return acc;
    }

    if (Array.isArray(value)) {
      const tmp = value.join(',');
      acc += `${key}=${tmp}&`;
    } else {
      acc += `${key}=${value}&`;
    }
    return acc;
  }, '')

  if (paramsString[paramsString.length - 1] === '&') {
    paramsString = paramsString.slice(0, -1);
  }

  return `${url}?${paramsString}`;
}

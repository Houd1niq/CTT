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

export interface PatentsBody {
  page?: number,
  sort?: string,
  technologyFieldId?: number[],
  patentTypeId?: number[],
}

export interface PatentsSearchBody extends Omit<PatentsBody, 'page'> {
  query: string
}

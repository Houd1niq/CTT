export interface SearchSliceState {
  patentTypeFilters: number[];
  technologyFieldFilters: number[];
  patentSort?: string;
  searchQuery?: string;
  page: number
  totalPages?: number
}

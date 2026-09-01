// Generic shape of a paginated API response: the current page of items
// plus the totals the UI needs to render page controls.
export interface PagedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}
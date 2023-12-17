
export interface GenericRepository<T> {

    persist(t: T): Promise<T>
}

export interface GenericRepository<T> {

    persist(t: T): Promise<T>

    getByPkey(pkey: string) : Promise<T>
}

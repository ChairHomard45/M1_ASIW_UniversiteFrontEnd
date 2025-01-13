export interface IDAO<T> {
  create(data: T): Promise<T>;
  get(id: number): Promise<T>;
  update(id: number, data: T): Promise<T>;
  delete(id: number): Promise<void>;
  list(): Promise<T[]>;
}
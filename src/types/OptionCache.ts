export default interface IOptionCache {
  add(id: string, outcome: any): void;
  get<T>(id: string): T | null;
  delete<T>(id: string): T | null;
}

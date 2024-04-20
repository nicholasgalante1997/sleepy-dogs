import { ID } from './ID.js';

export default interface IOptionCache {
  add(id: ID, outcome: any): void;
  get<T>(id: ID): T | null;
  delete<T>(id: ID): T | null;
  has(id: ID): boolean;
}

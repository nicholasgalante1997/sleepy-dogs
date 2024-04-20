import { ID } from '../../types/ID.js';
import IOptionCache from '../../types/OptionCache.js';

export default class OptionCache implements IOptionCache {
  private _record = new Map<string, any>();

  private static encodeId(id: ID): string {
    if (Array.isArray(id)) {
      return id.join('_');
    }
    return id;
  }

  add(id: ID, result: any) {
    this._record.set(OptionCache.encodeId(id), result);
  }

  get<T>(id: ID): T | null {
    return this._record.get(OptionCache.encodeId(id));
  }

  has(id: ID): boolean {
    return this._record.has(OptionCache.encodeId(id));
  }

  delete<T>(id: ID): T | null {
    const item = this._record.get(OptionCache.encodeId(id));
    if (item) {
      const copy = Object.create(item);
      Object.freeze(copy);
      this._record.delete(OptionCache.encodeId(id));
      return copy as T;
    }
    return null;
  }
}

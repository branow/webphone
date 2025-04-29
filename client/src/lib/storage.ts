export default class Storage<T> {
  key: string;
  constructor(key: string) {
    this.key = key;
  }
  set(obj: T) {
    const json = JSON.stringify(obj)
    localStorage.setItem(this.key, json)
  }
  get(): T | null {
    const json = localStorage.getItem(this.key)
    if (!json) return null
    return JSON.parse(json)
  }
  remove(): void {
    localStorage.removeItem(this.key)
  }
}

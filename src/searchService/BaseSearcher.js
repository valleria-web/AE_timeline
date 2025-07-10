export default class BaseSearcher {
  constructor(items = []) {
    this.items = items;
  }

  search(query) {
    throw new Error("search() debe implementarse en la subclase");
  }
}

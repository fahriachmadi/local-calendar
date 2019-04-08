class StorageHelper {
  static getAttribute(attr_name) {
    return localStorage.getItem(attr_name)
  }
}
export default StorageHelper

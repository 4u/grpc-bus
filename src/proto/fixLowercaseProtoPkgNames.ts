export function fixLowercaseProtoPkgNames<T> (root: T): T & import('protobufjs').Root {
  const temp: any = root;
  if (!temp.FIXED_LOWERCASE && temp.nested) {
    temp.FIXED_LOWERCASE = true;
    Object.keys(temp.nested).forEach(key => {
      if (!(key in temp)) {
        temp[key] = temp.nested[key];
        fixLowercaseProtoPkgNames(temp[key]);
      }
    });
  }
  return temp as T & import('protobufjs').Root;
}

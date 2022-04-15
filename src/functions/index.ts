export function isObjectEquals(x: any, y: any): boolean {
  if (x === y) {
    return true;
  }

  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  if (x.constructor !== y.constructor) {
    return false;
  }

  for (let p in x) {
  
    if (!(p in y)) {
      return false;
    }

    if (x[p] === y[p]) {
      continue;
    }

    if (typeof x[p] !== 'object') {
      return false;
    }

    if (!isObjectEquals(x[p], y[p])) {
      return false;
    }
  }
  for (let p in y) {
    if (!(p in x)) {
      return false;
    }
  }
  return true;
}

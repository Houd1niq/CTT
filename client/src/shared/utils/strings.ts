export function concatUrlWithQueryParams(url: string, queryParams: Record<string, number | string | number[]>) {
  let paramsString = Object.keys(queryParams).reduce<string>((acc, key) => {
    const value = queryParams[key];

    if ((Array.isArray(value) && !value.length) || !value) {
      return acc;
    }

    if (Array.isArray(value)) {
      const tmp = value.join(',');
      acc += `${key}=${tmp}&`;
    } else {
      acc += `${key}=${value}&`;
    }
    return acc;
  }, '')

  if (paramsString[paramsString.length - 1] === '&') {
    paramsString = paramsString.slice(0, -1);
  }

  return `${url}?${paramsString}`;
}

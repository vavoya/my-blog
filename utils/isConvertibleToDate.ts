export function isConvertibleToDate (str: string)  {
    const d = new Date(str);
    return !isNaN(d.getTime());
}
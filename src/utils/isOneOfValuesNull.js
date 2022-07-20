const isOneOfValuesNull = (values = []) => {
    return values.some(value => value === null || value === undefined || value === "");
}

export default isOneOfValuesNull;
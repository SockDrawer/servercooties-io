export class Deserialize {
    //tslint:disable:next-line no-any
    public static byName (data: any, name: string): any {
        return data !== undefined ? data[name] : undefined;
    }
    //tslint:disable:next-line no-any
    public static boolean (data: any, name: string, defaultValue?: boolean): boolean {
        const value = Deserialize.byName(data, name);
        if (value === undefined) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
            return defaultValue;
        }
        if (typeof value !== 'boolean') {
            throw new Error(`Field ${name} must be a boolean`);
        }
        return value;
    }
    //tslint:disable:next-line no-any
    public static string (data: any, name: string, defaultValue?: string): string {
        const value = Deserialize.byName(data, name);
        if (!value) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
        } else if (typeof value !== 'string') {
            throw new Error(`Field ${name} must be a string`);
        }
        return value || defaultValue;
    }
    //tslint:disable:next-line no-any
    public static number (data: any, name: string, minValue?: number, maxValue?: number, defaultValue?: number): number {
        minValue = minValue !== undefined ? minValue : 0;
        maxValue = maxValue !== undefined ? maxValue : 100;
        let value = Deserialize.byName(data, name);
        if (value === undefined) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
            value = defaultValue;
        }
        if (typeof value !== 'number') {
            throw new Error(`Field ${name} must be a number`);
        }
        if (value < minValue || value > maxValue) {
            throw new RangeError(`Field ${name} must be between ${minValue} and ${maxValue}`);
        }
        return value;
    }
    public static list (data: any, name: string, defaultValue?: string[]): string[] {
        const value = Deserialize.byName(data, name);
        if (!value) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
        } else if (!Array.isArray(value) || value.some((elem: any) => typeof elem !== 'string')) {
            throw new Error(`Field ${name} must be an array of string`);
        }
        return value || defaultValue;
    }
    public static map (data: any, name: string, defaultValue?: Map<string, string>): Map<string, string> {
        const value = Deserialize.byName(data, name);
        if (!value) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
            return defaultValue;
        }
        const result = new Map<string, string>();
        if (defaultValue !== undefined) {
            defaultValue.forEach((ivalue: string, key: string) => {
                result.set(key, ivalue);
            });
        }
        Object.keys(value).forEach((key: string) => {
            result.set(key, `${value[key]}`);
        });
        return result;
    }
}

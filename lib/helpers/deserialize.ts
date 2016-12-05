//tslint:disable:next-line no-any
export class Deserialize {
    public static string (data: any, name: string, defaultValue?: string): string {
        if (!data[name]) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
        } else if (typeof data[name] !== 'string') {
            throw new Error(`Field ${name} must be a string`);
        }
        return data[name] || defaultValue;
    }
    public static number (data: any, name: string, minValue?: number, maxValue?: number, defaultValue?: number): number {
        minValue = minValue !== undefined ? minValue : 0;
        maxValue = maxValue !== undefined ? maxValue : 100;
        let value = data[name];
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
        if (!data[name]) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
        } else if (!Array.isArray(data[name]) || data[name].some((elem: any) => typeof elem !== 'string')) {
            throw new Error(`Field ${name} must be an array of string`);
        }
        return data[name] || defaultValue;
    }
    public static map (data: any, name: string, defaultValue?: Map<string, string>): Map<string, string> {
        if (!data[name]) {
            if (defaultValue === undefined) {
                throw new Error(`Field ${name} is required`);
            }
            return defaultValue;
        }
        const result = new Map<string, string>();
        if (defaultValue !== undefined) {
            defaultValue.forEach((value: string, key: string) => {
                result.set(key, value);
            });
        }
        const obj = data[name];
        Object.keys(obj).forEach((key: string) => {
            result.set(key, `${obj[key]}`);
        });
        return result;
    }
}

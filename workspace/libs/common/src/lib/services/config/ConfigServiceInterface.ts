export interface ConfigServiceInterface {
    /**
     *
     * @param {string} path Can be Path in form "field.items[0].name"
     * @param defaultValue
     * @return {any|null}
     */
    get(path: string, defaultValue?: any): any;

    has(path: string): boolean;

    getAll(): { [key: string]: string };

    set(path: string, value: any, override?: boolean): boolean;
}

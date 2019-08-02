import Store from 'electron-store';

const ERROR_UNKNOW = 1;
const ERROR_PERMISSION_DENY = 2;

const store = new Store();

export function get(key: string): any {
    return store.get(key, undefined);
}

export function set(key: string, value: any | undefined): void {
    if (!value) store.delete(key);
    else store.set(key, value);
}
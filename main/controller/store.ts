import Store from 'electron-store';

const store = new Store();

export const SCHEMA = {
	installPath: 'installPath',
	gamePath: 'gamePath',
};

export function get(key: string) : any{
    return store.get(key, undefined);
}

export function set(key: string, value: any | undefined) : void{
	if(!value) store.delete(key);
    else store.set(key, value);
}
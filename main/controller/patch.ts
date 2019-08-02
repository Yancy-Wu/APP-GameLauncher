import MetaInfo from './meta';
import { patchSavedPath } from './filepath';
import { patch } from '../base/patch';
import CONFIG from '../config';
import * as Store from '../base/store';

export function patchClient(meta: MetaInfo, callback: () => void): void {
    patch(Store.get(CONFIG.schema.gamePath), patchSavedPath(meta), callback);
}
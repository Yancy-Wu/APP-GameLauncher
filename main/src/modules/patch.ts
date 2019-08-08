import MetaInfo from '../base/meta';
import Patcher from '../func-ext/patch';
import CONFIG from '../base/config';
import { patchSavedPath } from './filepath';
import * as Store from '../func-int/store';

export class PatchClient extends Patcher {
    constructor(meta: MetaInfo) {
        super(Store.get(CONFIG.schema.gamePath), patchSavedPath(meta));
    }
}
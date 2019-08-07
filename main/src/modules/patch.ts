import MetaInfo from './meta';
import patch from '../func-ext/patch';
import CONFIG from '../config';
import { patchSavedPath } from './filepath';
import * as Store from '../func-int/store';
import { Progress } from '../types';

export async function patchClient(meta: MetaInfo, progress: Progress) {
    await patch(Store.get(CONFIG.schema.gamePath), patchSavedPath(meta), progress);
}
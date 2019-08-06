""" patch.py """
import os
import base64
import json
from patch.meta_file import MetaFile


def dir_to_dict(dir_name):
    """ flattening tree-like dir struct to map. key is path """
    res = dict()
    saved_dir = os.path.abspath(os.getcwd())
    os.chdir(dir_name)
    for root, _, files in os.walk('.'):
        for name in files:
            rpath = os.path.join(root, name)
            rpath = rpath.replace('\\', '/')
            res.update({rpath: MetaFile(dir_name, rpath)})
    os.chdir(saved_dir)
    return res


class Patch:

    """ 1. generate differences between two dirs and save it to patch.
        2. do patch to current dir. """

    # linear traversal, O(n)
    root = None
    file_dict = dict()
    diff_chunksize = None

    def __init__(self, root, chunksize=1024*1024*1024*4):
        """ max support file size, exceed it will lead to file split.
            diff_chunksize in terms of diff process. """

        self.root = root
        self.file_dict = dir_to_dict(root)
        self.diff_chunksize = (chunksize >> 2) * 3

    def _top1(self, meta):
        """ find source file which most similar to cur meta file. (or none)
            for simplicity, we only find the exclusive one from all origin file.
            the algorithm is easy, maybe improve later. """

        candidate = None
        same = False
        for _, mfile in self.file_dict.items():
            similarity = meta.similarity(mfile)
            if not similarity['hash_neq']:
                candidate = mfile
                same = True
                break
            if not similarity['name_diff']:
                candidate = mfile
        return candidate, same

    def _generate_patch_info(self, mfile):
        """ generate patch info for a meta_file.
            find candidate source meta_file, select the best.
            then calculate diff. (maybe find nothing)
            @param mfile: to generate patch info meta_file.
            @return source: source meta_file or None
            @return patch: an iterable object contains all patch info pieces. """

        source, same = self._top1(mfile)
        patch = None
        if not same and source:
            patch = mfile.diff_from_file(source, self.diff_chunksize)
        return source, patch

    def generate_patch(self, ddir, saved_file):
        """ generate patch file for specific dir.
            @param ddir: to patch destination dir.
            @param saved_file: saved file name(absolute), using JSON format """

        file = open(saved_file, 'w')
        for _, mfile in dir_to_dict(ddir).items():
            smfile, patch = self._generate_patch_info(mfile)
            print('[handling]: ', mfile.r_path(), '\t', end='')

            record = {'path': mfile.r_path()}
            # found nothing, a new file.
            if not smfile:
                print('***** new file detected *****')
                serialize = base64.b64encode(mfile.read()).decode('ascii')
                record.update({'operation': 'new', 'data': serialize})
                json.dump(record, file, ensure_ascii=False)
                file.write('\n')

            # do nothing, file not changed.
            if smfile and mfile.r_path() == smfile.r_path() and not patch:
                print('***** skip *****')
                record.update({'operation': 'none'})

            # file has been moved.
            if smfile and mfile.r_path() != smfile.r_path() and not patch:
                print('***** file moved *****')
                record.update({'operation': 'moved', 'from': smfile.r_path()})
                json.dump(record, file, ensure_ascii=False)
                file.write('\n')

            # file has been modified.
            # it should be wrote each loop.
            if smfile and mfile.r_path() == smfile.r_path() and patch:
                print('***** file modified *****')
                for data, spos, epos, pos in patch:
                    serialize = base64.b64encode(data).decode('ascii')
                    record.update({'operation': 'modified',
                                   'start': spos,
                                   'end': epos,
                                   'isFinished': pos == mfile.size(),
                                   'data': serialize})
                    json.dump(record, file, ensure_ascii=False)
                    file.write('\n')

    def _remove_suffix(self):
        ''' remove .done suffix. '''
        for root, _, files in os.walk(self.root):
            for name in files:
                prefix, suffix = os.path.splitext(name)
                if suffix == '.done':
                    MetaFile(root, name).move(prefix)

    def do_patch(self, patch_file):
        """ do patch to cur dir. you cannot call this function recursively.
            (if you want patch dir continuously, you must new another Patch)
            support resuming from breaking-point.
            @param patch_file: patch file path(absolute). """

        save_des = dict()
        for record in open(patch_file, 'r'):
            record = json.loads(record)
            path = record['path']
            if MetaFile(self.root, path + '.done').exist():
                continue
            print('*****handling:', path, '*****')

            # generating new file.
            # .creating suffix when writing data.
            # .done suffix when write complete.
            # no suffix when all file handled.
            if record['operation'] == 'new':
                data = base64.b64decode(record['data'].encode('ascii'))
                mfile = MetaFile(self.root, path + '.creating')
                mfile.write(data)
                mfile.move(path + '.done')

            # moving existed file.
            # .copying suffix when copying data.
            # .done suffix when copying complete.
            # no suffix and override origin file when all file handled.
            # (because maybe such case: f1 be renamed to f2, then f1 be patched)
            if record['operation'] == 'moved':
                spath = record['from']
                mfile = self.file_dict[spath]
                mfile = mfile.copy(path + '.copying')
                mfile.move(path + '.done')

            # modifing existed file.
            # .patching suffix when saving patch data piece by piece.
            # .done suffix when patching complete.
            # no suffix and override origin file when all file handled.
            if record['operation'] == 'modified':
                data = base64.b64decode(record['data'].encode('ascii'))
                mfile = self.file_dict[path]
                desfile = save_des.get(path)
                if not desfile:
                    desfile = MetaFile(self.root, path + '.patching')
                    save_des.update({path: desfile})
                mfile.patch_to_file(
                    desfile, record['start'], record['end'], data)
                if record['isFinished']:
                    desfile.move(path + '.done')

        # remove all .done suffix to complete patch
        self._remove_suffix()

    def clear_patch(self):
        ''' clear all tmp patch file.
            include .creating .copying .patching and .done file '''

        for root, _, files in os.walk(self.root):
            for name in files:
                _, suffix = os.path.splitext(name)
                if suffix in ['.done', '.copying', '.patching', '.creating']:
                    MetaFile(root, name).delete()

""" meta_file.py """
import hashlib
import os
import shutil
import Levenshtein
import bsdiff4


class MetaFile:

    """ provide file info to compare similarity between two files.
        provide common file operation such as move, delete and new.
        provide file diff calculation and patch. """

    rpath = None
    root = None
    md5 = None

    def __init__(self, root, rpath):
        self.rpath = rpath
        self.root = root

    def r_path(self):
        """ return relative file path """
        return self.rpath

    def path(self):
        """ return full file path """
        return os.path.join(self.root, self.rpath)

    def size(self):
        """ return file size """
        return os.path.getsize(self.path())

    def exist(self):
        """ whether cur file exist """
        return os.path.exists(self.path())

    def hash(self):
        """ compute md5 of file, call this func as less as possible. """
        if self.md5:
            return self.md5
        file = open(self.path(), 'rb')
        md5_obj = hashlib.md5()
        while True:
            data = file.read(8096)
            if not data:
                break
            md5_obj.update(data)
        file.close()
        self.md5 = md5_obj.hexdigest()
        return self.md5

    def similarity(self, mfile):
        """ compare similarity between two files.
            @return {size_diff, name_diff, hash_neq},
            size_diff and name_diff are precentage. """

        size_diff = abs(self.size() - mfile.size())
        name_diff = Levenshtein.distance(self.rpath, mfile.rpath)
        return {
            'size_diff': size_diff / (min(self.size(), mfile.size()) + 1),
            'name_diff': name_diff / max(len(self.rpath), len(mfile.rpath)),
            'hash_neq': 1 if size_diff != 0 else self.hash() != mfile.hash()
        }

    def read(self):
        """ read all file. """

        with open(self.path(), 'rb') as file:
            return file.read()

    def write(self, data):
        """ write data. automatically create """

        tdir, _ = os.path.split(self.path())
        if not os.path.exists(tdir):
            os.mkdir(tdir)
        with open(self.path(), 'wb') as file:
            file.write(data)

    def read_in_chunks(self, chunksize):
        """ Lazy function (generator) to read a file piece by piece.
            @return: a iterative object contains all file data.
            pos means how many bytes of data we have read. """

        with open(self.path(), 'rb') as file:
            while True:
                data = file.read(chunksize)
                pos = file.tell()
                if not data:
                    break
                yield data, pos

    def append_data(self, data):
        """ append binary data to current file.
            automatically create if current file not exist. """

        tdir, _ = os.path.split(self.path())
        if not os.path.exists(tdir):
            os.mkdir(tdir)
        with open(self.path(), 'ab+') as file:
            file.write(data)

    def move(self, rpath):
        """ move file to destination(relative).
            automatic create, override, and rename if current file not
            exist, has exist and is itself. """

        destination = os.path.join(self.root, rpath)
        if os.path.exists(destination):
            os.remove(destination)
        tdir, _ = os.path.split(destination)
        if not os.path.exists(tdir):
            os.mkdir(tdir)
        shutil.move(self.path(), destination)
        self.rpath = rpath

    def copy(self, rpath):
        """ copy file to destination(relative). it will override exists.
            return new meta_file object """

        destination = os.path.join(self.root, rpath)
        if os.path.exists(destination):
            os.remove(destination)
        tdir, _ = os.path.split(destination)
        if not os.path.exists(tdir):
            os.mkdir(tdir)
        shutil.copy(self.path(), destination)
        return MetaFile(self.root, rpath)

    def delete(self):
        """ delete current file and destory self. """
        os.remove(self.path())
        del self

    def diff_from_file(self, mfile, mm_use):
        """ calc diff: using bsdiff to generate patch data
            automatic divide data, memory use will not exceed MAX_MEMORY_USE(not guarantee.)
            @param mm_use MAX_MEMORY_USE.
            @return an iterative object saving diff data for each of chunksize """

        total_size = self.size() + mfile.size()
        chunksize = mm_use if mm_use > total_size else mm_use / 3
        for chunk, pos in self.read_in_chunks(chunksize):
            min_patch = None
            start = 0
            end = 0
            for schunk, spos in mfile.read_in_chunks(chunksize):
                patch = bsdiff4.diff(schunk, chunk)
                if not min_patch or len(patch) < len(min_patch):
                    min_patch = patch
                    start = end
                    end = spos
            yield min_patch, start, end, pos

    def patch_to_file(self, mfile, start, end, patch):
        """ do patch: using bsdiff to patch data
            NOTE: pass the same mfile throughout can combine patch results.
            @param mfile: file where patch data will store.
            @param start: the start pos of to-patched data.
            @param end: the end pos of to-patched data.
            @param patch: patch data. """

        with open(self.path(), 'rb') as file:
            file.seek(start, 0)
            sdata = file.read(end - start)
            res = bsdiff4.patch(sdata, patch)
            mfile.append_data(res)

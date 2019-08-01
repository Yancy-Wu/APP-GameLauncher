"""
    patch.py
    0. usage:
        for server: generate diff file between two dir.
        for client: do patch to a dir.

    1. command options:
        --diff: generate diff file.
            -s: source dir path.
            -t: target dir path.
            -f: saved file path(name).
        --patch: patch file.
            -s: source dir path.
            -f: patch file path(name).
        --clear: clear intermediate patch file.
            -s: source dir path.

    2. IPC through stdout. see func print_progress for detail.

    3. output interface reference: see '../client/src/API/patch.ts'
        PatchInfo interface for detail.
"""

import sys
import getopt
from patch.patch import Patch


def do_diff(spath, tpath, fpath):
    ''' do diff, source_path, target_path and file_saved_path '''
    if not spath or not tpath or not fpath:
        sys.exit(2)
    patch = Patch(spath)
    patch.generate_patch(tpath, fpath)


def do_patch(spath, fpath):
    ''' do patch, source_path, file_patch_path '''
    if not spath or not fpath:
        sys.exit(2)
    patch = Patch(spath)
    patch.do_patch(fpath)

def do_clear(spath):
    ''' do clear, clear all intermediate patch file in dir '''
    if not spath:
        sys.exit(2)
    patch = Patch(spath)
    patch.clear_patch()


def main(argv):
    ''' entry point '''

    spath = ''
    tpath = ''
    filepath = ''
    operation = ''

    for key, val in getopt.getopt(argv, "s:t:f:", ['diff', 'patch', 'clear'])[0]:
        if key == '--diff':
            operation = 'diff'
        elif key == '--patch':
            operation = 'patch'
        elif key == '--clear':
            operation = 'clear'
        elif key == '-s':
            spath = val
        elif key == '-t':
            tpath = val
        elif key == '-f':
            filepath = val

    if not operation:
        print('--diff or --patch, choose one.\n')
        sys.exit()

    if operation == 'diff':
        do_diff(spath, tpath, filepath)

    if operation == 'patch':
        do_patch(spath, filepath)

    if operation == 'clear':
        do_clear(spath)

main(sys.argv[1:])

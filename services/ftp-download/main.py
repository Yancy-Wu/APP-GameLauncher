"""
    ftp-download.py
    0. usage:
        download file from remote ftp server, no username, no password.
        automatically resuming from last breaking-point.

    1. command options:
        -i(ip address): the ftp server ip addr to which we connect.
        -r(remote path): the remote ftp file path to download.
        -l(local path): local saved file path.

    2. IPC through stdout. see func print_progress for detail.

    3. output interface reference: see '../client/src/API/download.ts'
        DownloadInfo interface for detail.
"""
import ftplib
import sys
import getopt
import os
import shutil
import threading
import time
import json

ERROR_LOCAL_FILE_EXIST = 2
ERROR_CONNECT_FAILED = 3

SLEEP_TIME = 1
TMP_FILE_SUFFIX = '.tmp'


def print_progress(file, size):
    """ print download progress timely to standard output.
        redirect it to parent process to IPC. """

    while True:
        downloaded_size = file.tell()
        done = 1 if size == downloaded_size else 0
        out = {
            "type": "info",
            "downloadedBytes": downloaded_size,
            "done": done}
        print(json.dumps(out))
        sys.stdout.flush()
        if done == 1:
            break
        time.sleep(SLEEP_TIME)


def main():
    """ given ip_address and remote server file path
        download it to local file path.
        support resuming from break-point """

    ip_addr = ''
    remote_file = ''
    local_file = ''

    for key, val in getopt.getopt(sys.argv[1:], "i:r:l:")[0]:
        if key == '-i':
            ip_addr = val
        elif key == '-r':
            remote_file = val
        elif key == '-l':
            local_file = val

    if not ip_addr or not remote_file or not local_file:
        sys.exit(0)

    ldname, _ = os.path.split(local_file)
    if os.path.exists(local_file):
        sys.exit(ERROR_LOCAL_FILE_EXIST)
    if not os.path.exists(ldname):
        os.mkdir(ldname)

    flocal = open(local_file + TMP_FILE_SUFFIX, 'ab+')
    flocal.seek(0, 2)
    rest_offset = flocal.tell()

    ftp = ftplib.FTP(ip_addr)
    ftp.login()
    rdname, rfname = os.path.split(remote_file)
    ftp.cwd(rdname)
    size = ftp.size(rfname)

    threading.Thread(target=print_progress, args=(flocal, size)).start()
    ftp.retrbinary('RETR ' + rfname, flocal.write, rest=rest_offset)
    time.sleep(2 * SLEEP_TIME)
    ftp.close()
    flocal.close()
    shutil.move(local_file + TMP_FILE_SUFFIX, local_file)


if __name__ == "__main__":
    main()

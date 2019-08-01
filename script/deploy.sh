#!/bin/bash

<<'COMMENT'
    dependencies:
    python3, python3-pip, 7z
COMMENT

old_dir=$1
new_dir=$2
version=$3
exePath=$4

# old_dir new_dir version must not null.
if [ ! $old_dir ] || [ ! $new_dir ] || [ ! $version ] || [ ! $exePath ]
then
    echo 'usage: deploy [NEW-VERSION-DIR] [OLD-VERSION-DIR] [VERSION] [EXE-PATH]'
    exit 0
fi

# old_dir new_dir must be dir.
if [ ! -d $old_dir ] || [ ! -d $new_dir ] 
then
    echo 'ERROR: old_dir or new_dir are not directory!'
    exit 0
fi

# create dir, save path
mkdir $version
old_dir=$(cd $old_dir; pwd)
new_dir=$(cd $new_dir; pwd)
saved_dir="$(pwd)/$version"

# python3 depenency:
echo -e '\e[32m ***** INSTALLING PYTHON3 DEPENDENCIES ***** \e[0m'
python3 -m pip install python-Levenshtein
python3 -m pip install bsdiff4

# generating patch file, assuming patch python file is under ../server
echo -e '\e[32m ***** GENERATING PATCH FILE ***** \e[0m'
cd ../server
python3 -m patch --diff -s $old_dir -t $new_dir -f "$saved_dir/patch.json"

# generating client zip file.
echo -e '\e[32m ***** GENERATING CLIENT 7-ZIP FILE ***** \e[0m'
7z a -t7z "$saved_dir/client.7z" "$new_dir/*" -r -ms -mmt

# generating md5 file.
echo -e '\e[32m ***** GENERATING MD5 FILE ***** \e[0m'
md5file="$saved_dir/md5.json"
echo -e '\c' > $md5file
IFS_SAVED=$IFS
IFS=$'\n'
function read_dir(){
    local cur="$new_dir/$1"
    for file in `ls -1 $cur`
    do
        local rpath="$1"/"$file"
        local path="$cur/$file"
        if [ -d $path ]
        then
            read_dir $rpath
        else
            echo $rpath
            local out=$(md5sum -b $path)
            out=${out%% *}
            echo "{\"path\": \"$rpath\", \"md5\": \"$out\"}" >> $md5file
        fi
    done
}
read_dir .
IFS=$IFS_SAVED

# collecting info
echo -e '\e[32m ***** GENERATING META FILE ***** \e[0m'
metaFile="$saved_dir/meta.json"
echo -e "{" > $metaFile
function writeJsonRecord(){
    if [ "$3" == END ]
    then
        echo " \"$1\":\"$2\"" >> $metaFile
    else
        echo " \"$1\":\"$2\"," >> $metaFile
    fi
}
writeJsonRecord "clientSizeBytes" $(du -bs $new_dir)
writeJsonRecord "patchSizeBytes" $(du -bs "$saved_dir/patch.json")
writeJsonRecord "patchMd5" $(md5sum "$saved_dir/patch.json")
writeJsonRecord "patchFileUrl" "patch.json"
writeJsonRecord "exeSizeBytes" $(du -bs "$saved_dir/client.7z")
writeJsonRecord "exeFileUrl" "client.7z"
writeJsonRecord "exeMd5" $(md5sum "$saved_dir/client.7z")
writeJsonRecord "md5ListFileUrl" "md5.json"
writeJsonRecord "version" $version
writeJsonRecord "exePath" $exePath END
echo '}' >> $metaFile

echo -e '\e[32m ***** DONE ***** \e[0m'
#!/bin/bash
<<'COMMENT'
    dependencies:
    7z
COMMENT

dir=$1
version=$2
exePath=$3

# old_dir dir version must not null.
if [ ! $dir ] || [ ! $version ] || [ ! $exePath ]
then
    echo 'usage: init [FIRST-VERSION-DIR] [VERSION] [EXE-PATH]'
    exit 0
fi

# must be dir.
if [ ! -d $dir ]
then
    echo 'ERROR: first version dir are not directory!'
    exit 0
fi

# create dir, save path
mkdir $version
dir=$(cd $dir; pwd)
saved_dir="$(pwd)/$version"

# generating client zip file.
echo -e '\e[32m ***** GENERATING CLIENT 7-ZIP FILE ***** \e[0m'
7z a -t7z "$saved_dir/client.7z" "$dir/*" -r -ms -mmt

# generating md5 file.
echo -e '\e[32m ***** GENERATING MD5 FILE ***** \e[0m'
md5file="$saved_dir/md5.json"
echo -e '\c' > $md5file
IFS_SAVED=$IFS
IFS=$'\n'
function read_dir(){
    local cur="$dir/$1"
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
writeJsonRecord "clientSizeBytes" $(du -bs $dir)
writeJsonRecord "patchSizeBytes"
writeJsonRecord "patchMd5"
writeJsonRecord "patchFileUrl"
writeJsonRecord "exeSizeBytes" $(du -bs "$saved_dir/client.7z")
writeJsonRecord "exeFileUrl" "client.7z"
writeJsonRecord "exeMd5" $(md5sum "$saved_dir/client.7z")
writeJsonRecord "md5ListFileUrl" "md5.json"
writeJsonRecord "version" $version
writeJsonRecord "exePath" $exePath END
echo '}' >> $metaFile

echo -e '\e[32m ***** DONE ***** \e[0m'
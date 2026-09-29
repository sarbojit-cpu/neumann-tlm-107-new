#!/bin/sh
# Chunked (resumable) silent 4K render of TLM107, joined losslessly.
#   sh scripts/render.sh <outname> '<props json>'
set -e
NAME=$1; PROPS=${2:-'{"bpm":134,"drop":3}'}
FRAMES=1800; CHUNK=300
D=out/$NAME-chunks; mkdir -p $D
i=0
while [ $i -lt $FRAMES ]; do
  e=$((i + CHUNK - 1)); [ $e -ge $FRAMES ] && e=$((FRAMES - 1))
  f=$D/$(printf '%05d' $i).mp4
  if [ ! -s "$f" ]; then
    n=0
    until timeout -k 20 1500 npx remotion render TLM107 "$f.tmp.mp4" --props="$PROPS" --frames=$i-$e --scale=2 --muted --concurrency=${CONC:-4} --crf=${CRF:-17} --jpeg-quality=93 --log=error; do
      n=$((n + 1)); rm -f "$f.tmp.mp4"
      [ $n -ge 3 ] && { echo "chunk $i-$e FAILED"; exit 1; }
      echo "chunk $i-$e retry $n"
    done
    mv "$f.tmp.mp4" "$f"
  fi
  echo "chunk $i-$e done $(date +%T)"
  i=$((e + 1))
done
ls $D/*.mp4 | grep -v tmp | sed "s#^#file '$PWD/#; s#\$#'#" > $D/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $D/list.txt -c copy -movflags +faststart out/$NAME.mp4
ffprobe -v error -count_frames -show_entries stream=nb_read_frames,width,height:format=duration,size -of default=nw=1 out/$NAME.mp4

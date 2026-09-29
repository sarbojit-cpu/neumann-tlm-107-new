#!/bin/sh
# Renders one film in 4K, in resumable chunks, from a single pre-built bundle.
#   sh scripts/render.sh <Composition> <name> <frames> <chunk>
# e.g.  sh scripts/render.sh Reel tlm107-reel 5400 300
#
# Frames are laid out at 1080p and rendered with --scale=2 (native 4K raster).
# Chunks are video-only; scripts/package.py muxes the mastered soundtrack.
set -e
COMP=$1; NAME=$2; FRAMES=$3; CHUNK=$4
BUNDLE=${BUNDLE:-/home/user/work/bundle}
D=${OUTDIR:-/home/user/work/render}/$NAME-chunks; mkdir -p "$D"
[ -d "$BUNDLE" ] || npx remotion bundle src/index.ts --out-dir "$BUNDLE" --log=error
i=0
while [ $i -lt $FRAMES ]; do
  e=$((i + CHUNK - 1)); [ $e -ge $FRAMES ] && e=$((FRAMES - 1))
  f=$D/$(printf '%05d' $i).mp4
  if [ ! -s "$f" ]; then
    n=0
    # a hung chunk is killed after 30 min and retried (3 attempts)
    until timeout -k 20 1800 npx remotion render "$BUNDLE" $COMP "$f.tmp.mp4" --frames=$i-$e --scale=2 --muted \
        --concurrency=${CONC:-4} --crf=${CRF:-16} --jpeg-quality=94 --log=error; do
      n=$((n + 1)); rm -f "$f.tmp.mp4"
      [ $n -ge 3 ] && { echo "chunk $i-$e FAILED after $n attempts"; exit 1; }
      echo "chunk $i-$e retry $n"
    done
    mv "$f.tmp.mp4" "$f"
  fi
  echo "$(date +%H:%M:%S) chunk $i-$e done $(du -h "$f" | cut -f1)"
  i=$((e + 1))
done
echo "all chunks done: $D"

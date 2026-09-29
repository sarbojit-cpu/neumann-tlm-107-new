#!/bin/sh
# Unattended finish: master clip -> bundle -> 4K renders -> packaged deliverables.
set -e
P=/home/user/neumann-tlm-107-new/tlm107-film
W=/home/user/work
D=/home/user/neumann-tlm-107-new/deliverables
log() { echo "$(date +%H:%M:%S) $*"; }

# 1. wait for the second half of the ESRGAN upscale
while pgrep -f "upvideo.py 41.2" >/dev/null; do sleep 30; done
grep -q "^done" $W/logs/upvideo_b.log || { log "upscale B did not finish"; exit 1; }

# 2. one master: recovered part A (src 0.96-41.20) + part B (41.20-84.00), grade baked in
if [ ! -s $W/clips/master.ok ]; then
  printf "file '%s'\nfile '%s'\n" $W/clips/tlm107_up_a.mp4 $W/clips/tlm107_up_b.mp4 > $W/clips/list.txt
  ffmpeg -v error -y -f concat -safe 0 -i $W/clips/list.txt -an \
    -vf "eq=contrast=1.08:saturation=1.06:brightness=-0.012" \
    -c:v libx264 -preset medium -crf 14 -pix_fmt yuv420p -g 25 -r 25 -movflags +faststart \
    $P/public/clips/tlm107-master.mp4
  n=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 $P/public/clips/tlm107-master.mp4)
  log "master frames: $n"
  echo $n > $W/clips/master.ok
fi

# 3. one bundle for every chunk
cd $P
rm -rf $W/bundle
npx remotion bundle src/index.ts --out-dir $W/bundle --log=error
rm -rf /tmp/remotion-webpack-bundle-* 2>/dev/null || true

# 4. reel, then film
CONC=4 sh scripts/render.sh Reel tlm107-reel 5400 300
python3 scripts/package.py $W/render/tlm107-reel-chunks audio/mix-reel.wav $D/reel-4k tlm107-reel-4k 95
CONC=4 sh scripts/render.sh Film tlm107-film 9000 300
python3 scripts/package.py $W/render/tlm107-film-chunks audio/mix-film.wav $D/video-4k tlm107-film-4k 95

# 5. stems
mkdir -p $D/audio-stems
cp audio/music-bed-reel.wav $D/audio-stems/tlm107-reel-music-bed.wav
cp audio/transition-sfx-reel.wav $D/audio-stems/tlm107-reel-transition-sfx.wav
cp audio/music-bed-film.wav $D/audio-stems/tlm107-film-music-bed.wav
cp audio/transition-sfx-film.wav $D/audio-stems/tlm107-film-transition-sfx.wav
log "PIPELINE DONE"

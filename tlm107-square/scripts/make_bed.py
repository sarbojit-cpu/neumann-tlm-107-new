"""Cut a 30 s music bed so a chosen downbeat lands on the video's drop, fade 3 s in / 3 s out,
normalise to -14 LUFS integrated (pure gain, no limiter), then mux onto the silent render.

  python3 scripts/make_bed.py <song> <src_drop_seconds> <video_drop_seconds> <silent.mp4> <out.mp4>

Raavana Mavandaa: 134 BPM, drop at 30.212 s in the song -> 3.000 s in the video.
"""
import re
import subprocess
import sys

song, src_drop, vid_drop, video, out = sys.argv[1:6]
start = float(src_drop) - float(vid_drop)
bed = out.rsplit(".", 1)[0] + "-music-bed.wav"
tmp = bed + ".cut.wav"


def run(*a):
    return subprocess.run(a, check=True, capture_output=True, text=True)


def lufs(path):
    err = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
    return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", err)[-1])


run("ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-t", "30", "-i", song, "-ar", "48000", "-ac", "2",
    "-af", "afade=t=in:st=0:d=3,afade=t=out:st=27:d=3", "-c:a", "pcm_s24le", tmp)
gain = -14.0 - lufs(tmp)
run("ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", f"volume={gain:.2f}dB", "-c:a", "pcm_s24le", bed)
# AAC can shift loudness by ~0.1 LU: measure the muxed file and trim once if needed.
for _ in range(2):
    run("ffmpeg", "-y", "-v", "error", "-i", video, "-i", bed, "-map", "0:v", "-map", "1:a", "-c:v", "copy",
        "-c:a", "aac", "-b:a", "320k", "-ar", "48000", "-t", "30", "-movflags", "+faststart", out)
    got = lufs(out)
    print(f"start={start:.3f}s gain={gain:.2f}dB final={got} LUFS")
    if abs(got + 14.0) < 0.05:
        break
    gain += -14.0 - got
    run("ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", f"volume={gain:.2f}dB", "-c:a", "pcm_s24le", bed)
subprocess.run(["rm", "-f", tmp])

#!/usr/bin/env python3
"""THE SCRIPT — Neumann TLM 107, reel (180 s) and film (300 s).

Every caption window is a whole number of beats on the Mortals grid (90 BPM,
one beat = 2/3 s) and carries:

    t   the burned-in caption as it appears on screen
    e   the word(s) inside t that switch to the serif-italic emphasis face
    h   the heading as the voice reads it (spoken first)
    x   the bridging narration for the same window
    ch  chapter index 0-4 (drives the pattern-ring progress in the HUD)
    s   the storyboard: shot tokens that fill the window, in beats

Pace: h + x never exceeds floor(window seconds × 152 / 60) words, so no window
is read faster than 152 wpm. The read is anchored to the picture window by
window, so a voice that runs a hair fast or slow never drifts past a cut.

Shot tokens  kind:subject:beats[:option]
    v  a clip from Neumann's own TLM 107 film (picture only, no audio)
    i  a product photograph, full frame, with a camera move
    c  a cut-out product on a lit stage (orbit, crane, parallax)
    m  a mosaic of several photographs
    z  a motion-graphics technical visualisation
"""
import math

BPM = 90.0
BEAT = 60.0 / BPM          # 0.6667 s
WPM = 152

# Every fact below was checked against Neumann's published data for the TLM 107
# (and retailer spec sheets that reproduce it): five patterns, navigation
# switch, pad −6/−12 dB, low cut 40/100 Hz, 141 dB SPL (153 dB with pad),
# 10 dB-A self-noise, 131 dB dynamic range, 11 mV/Pa, 20 Hz–20 kHz,
# transformerless, new dual-diaphragm edge-terminated capsule, display off
# after 15 s, 445 g, 64 × 145 mm, EA 4 elastic mount, AES 2013 Best of Show,
# TEC Award 2014, Neumann founded in Berlin in 1928.

# ── REEL — 2160 × 3840, 180 s. Music: song 41.400 → 221.400 ────────────────
# 0-3 bars hook · 3-17 drop · 17-33 breakdown · 33-43 build · 43-66 drop · tail
REEL_START_PAD = 0.0
REEL = [
 # HOOK ─────────────────────────────────────────────────────────────────────
 dict(b=3, ch=0, t="FIVE MICS. ONE BODY.", e="ONE BODY.", h="Five microphones.", x="One body.",
      s=["z:hook:3"]),
 dict(b=9, ch=0, t="QUIETER THAN THE ROOM", e="ROOM", h="Quieter than the room.",
      x="Just ten dB-A self-noise, below the air of a quiet studio.",
      s=["v:domeLeds:4", "z:noisefloor:5"]),
 # DROP 1 ───────────────────────────────────────────────────────────────────
 dict(b=12, ch=0, t="NEUMANN TLM 107", e="TLM 107", h="Neumann TLM 107.",
      x="A multi-pattern large-diaphragm condenser, designed and built in Germany, for every voice and every instrument you record.",
      s=["c:black_front:2:reveal", "v:xrayRot:2", "c:nickel_front:2", "i:grille_badge_dark:2", "v:domeLeds:2", "c:nickel_front_tall:2"]),
 dict(b=12, ch=0, t="FIVE POLAR PATTERNS", e="FIVE", h="Five polar patterns.",
      x="Omni, wide cardioid, cardioid, hypercardioid and figure-eight, from one capsule. One microphone does the work of five.",
      s=["v:polarRings:4", "z:polar5:8"]),
 dict(b=12, ch=0, t="ONE SWITCH", e="SWITCH", h="One switch.",
      x="Pattern, pad and low cut in one control. The ring lights up, then goes dark after fifteen seconds.",
      s=["v:navSwitch:2", "i:black_ring_macro:1", "i:nickel_ring_macro:1", "z:switch:8:patterns"]),
 dict(b=12, ch=0, t="NICKEL OR BLACK", e="OR", h="Nickel or black.",
      x="Two finishes with identical insides, classic bright nickel or discreet black, dressed to match your studio.",
      s=["v:badges:2", "c:nickel_ea4:2", "c:black_ea4:2", "i:black_ea4_brand:2", "c:nickel_ea4_b:2", "c:black_xlr_angle:2"]),
 dict(b=8, ch=0, t="THE SECRET?", e="SECRET?", h="The secret?",
      x="What makes it sound this open is what Neumann left out.",
      s=["v:grilleGlint:3", "i:black_leds_macro:2", "v:xrayFront:3"]),
 # BREAKDOWN ────────────────────────────────────────────────────────────────
 dict(b=12, ch=1, t="NO TRANSFORMER", e="NO", h="No transformer.",
      x="A transformerless circuit keeps the sound open and transparent, with full, unrestricted bass even at the highest levels.",
      s=["v:pcb:4", "z:signal:8"]),
 dict(b=12, ch=1, t="A BRAND-NEW CAPSULE", e="CAPSULE", h="A brand-new capsule.",
      x="Dual-diaphragm and edge-terminated, developed specifically for this microphone, so every pick attack and consonant stays true.",
      s=["v:capsule:4", "z:capsule:4", "v:xrayRot:4"]),
 dict(b=12, ch=1, t="20 Hz – 20 kHz", e="20 kHz", h="Twenty hertz to twenty kilohertz.",
      x="A balanced response in every pattern, and more neutral voicing than the TLM 103.",
      s=["v:freq:4", "z:freq:8"]),
 dict(b=12, ch=1, t="141 dB SPL", e="141", h="One hundred forty-one decibels.",
      x="Maximum SPL for kick drums, brass and screaming vocals, and one fifty-three with the two-stage pad.",
      s=["z:spl:12:pad"]),
 dict(b=8, ch=1, t="131 dB RANGE", e="131", h="One thirty-one dB range.",
      x="From a whisper to a snare hit, without strain.",
      s=["z:range:8"]),
 dict(b=8, ch=1, t="LOW CUT · 40 · 100 Hz", e="LOW CUT", h="Two low-cut filters.",
      x="Forty hertz kills rumble. One hundred is made for voice.",
      s=["z:lowcut:8"]),
 # BUILD ────────────────────────────────────────────────────────────────────
 dict(b=8, ch=2, t="NOW WATCH THIS", e="WATCH", h="Now watch this.",
      x="One microphone becomes five, with one press of a switch.",
      s=["v:xrayFront:4", "v:polarRings:4"]),
 dict(b=8, ch=2, t="OMNI", e="OMNI", h="Omni.",
      x="Every direction at once. The whole room, the choir and the ambience.",
      s=["z:polar:8:omni"]),
 dict(b=8, ch=2, t="CARDIOID", e="CARDIOID", h="Cardioid.",
      x="Focused forward, rejecting what's behind it. The classic choice for lead vocals.",
      s=["z:polar:8:cardioid"]),
 dict(b=8, ch=2, t="FIGURE-8", e="FIGURE-8", h="Figure-eight.",
      x="Front and back, deaf at the sides. Duets, interviews, and mid-side stereo.",
      s=["z:polar:8:fig8"]),
 dict(b=8, ch=2, t="WIDE & HYPER", e="HYPER", h="Wide cardioid and hypercardioid.",
      x="The in-between patterns, for the pickup your room needs.",
      s=["z:polar:8:widehyper"]),
 # DROP 2 ───────────────────────────────────────────────────────────────────
 dict(b=12, ch=3, t="ON VOCALS", e="VOCALS", h="On vocals.",
      x="Intimate, detailed and honest, without the hype of a coloured mic, and the hundred-hertz filter keeps it clean.",
      s=["c:nickel_ea4_stand:2:reveal", "i:nickel_purple:2", "i:nickel_console:2", "c:nickel_stand:2", "c:nickel_clip_angle:2", "c:white_ea4:2"]),
 dict(b=8, ch=3, t="ACOUSTIC GUITAR", e="GUITAR", h="On acoustic guitar.",
      x="Every string, pick attack, body and air, in natural balance.",
      s=["v:guitar:4", "i:badge_black_macro:2", "i:nickel_xlr_macro:2"]),
 dict(b=8, ch=3, t="DRUMS & PERCUSSION", e="DRUMS", h="On drums and percussion.",
      x="Congas, kick and overheads, all with headroom to spare.",
      s=["v:congas:4", "i:grille_badge_dark2:2", "i:badge_black_macro2:2"]),
 dict(b=8, ch=3, t="THE ORCHESTRA", e="ORCHESTRA", h="On the orchestra.",
      x="Switch to omni or figure-eight and capture the whole hall.",
      s=["v:orchestra:3", "v:console:3", "i:polar_chart:2"]),
 dict(b=12, ch=3, t="PODCAST & VOICE-OVER", e="PODCAST", h="On podcasts and voice-over.",
      x="Clear, close speech with self-noise far below the room, in a home studio or broadcast booth.",
      s=["m:homestudio:4", "c:black_front_tall:4", "c:black_ea4_stand:4"]),
 dict(b=12, ch=3, t="THE STUDIO SET", e="STUDIO SET", h="The Studio Set.",
      x="The TLM 107 with the EA 4 elastic mount against stand-borne noise, delivered in a wooden case.",
      s=["c:mount_black:2", "c:mount_nickel:2", "c:mount_nickel_parts:2", "c:cream_ea4:2", "i:box_open_black:2", "i:box_closed:1", "i:box_trio:1"]),
 dict(b=12, ch=4, t="AWARD-WINNING", e="AWARD-WINNING", h="Award-winning.",
      x="Best of Show at AES twenty-thirteen, a TEC Award in twenty-fourteen, from a Berlin name trusted since nineteen twenty-eight.",
      s=["z:awards:8", "i:heritage_vintage:2", "c:u87_eco:2"]),
 dict(b=8, ch=4, t="COMPLETE THE CHAIN", e="CHAIN", h="Complete the chain.",
      x="Pair it with Neumann monitors and headphones, capsule to speaker.",
      s=["z:ecosystem:8"]),
 dict(b=9, ch=4, t="WHICH ONE IS YOURS?", e="YOURS?", h="Which one is yours?",
      x="Comment nickel or black below, then hear it for yourself.",
      s=["v:badges:3", "c:nickel_front_tall:3", "c:black_front:3"]),
 # OUTRO — 6.000 s: logos, partner line, numbers, website, socials
 dict(end=True, ch=4, t="", e="", h="",
      x="Shivansh Electronics is the Exclusive Partner of the Neumann TLM 107 Studio Set. Follow us.",
      s=["z:outro:end"]),
]

# ── FILM — 3840 × 2160, 300 s. The song re-cut on whole bars ──────────────
# V 0.000-1.400 pickup · then bars on 1.400 + 2.6667 m
#  0-4 intro · 4-8 build · 8-16 verse · 16-18 break · 18-32 drop
# 32-48 breakdown · 48-52 build · 52-60 verse · 60-62 break · 62-76 drop
# 76-86 build · 86-109 drop · end screen 292.067-300.000
FILM = [
 # COLD OPEN ────────────────────────────────────────────────────────────────
 dict(pickup=True, b=8, ch=0, t="FIVE MICROPHONES. ONE BODY.", e="ONE BODY.", h="Five microphones. One body.",
      x="This is the Neumann TLM 107, and in five minutes you'll know why.",
      s=["z:hook:4", "v:domeLeds:4"]),
 dict(b=8, ch=0, t="BERLIN, SINCE 1928", e="1928", h="Berlin, since nineteen twenty-eight.",
      x="For almost a century, Neumann has shaped recorded sound.",
      s=["v:heritageA:4", "i:heritage_vintage:4"]),
 dict(b=8, ch=0, t="THE LEGENDS CAME FIRST", e="LEGENDS", h="The legends came first.",
      x="Now their knowledge lives inside a modern, multi-pattern design.",
      s=["v:heritageB:4", "c:u87_eco:2", "c:tube_mic_psu:2"]),
 dict(b=8, ch=0, t="THE NEXT CHAPTER", e="NEXT", h="The next chapter.",
      x="A new microphone, built for every voice and every instrument.",
      s=["v:heritageC:4", "v:dome:4"]),
 dict(b=12, ch=0, t="MADE IN GERMANY", e="GERMANY", h="Made in Germany.",
      x="A large-diaphragm condenser microphone, with a newly developed dual-diaphragm capsule, created specifically for the Neumann TLM 107.",
      s=["v:domeLeds:4", "i:badge_black_macro:4", "v:xrayRot:4"]),
 dict(b=12, ch=0, t="EDGE-TERMINATED CAPSULE", e="EDGE-TERMINATED", h="Edge-terminated.",
      x="The capsule was inspired by Neumann's digital D-01, and tuned for outstanding transient response in every single polar pattern.",
      s=["v:capsule:4", "z:capsule:8"]),
 dict(b=8, ch=0, t="EVERY DETAIL, DELIBERATE", e="DELIBERATE", h="Every detail, deliberate.",
      x="From the finely woven grille to the illuminated chrome ring.",
      s=["v:grilleBlack:4", "v:nickelSide:4"]),
 dict(b=8, ch=0, t="MEET THE TLM 107", e="TLM 107", h="Meet the TLM 107.",
      x="The studio reference that adapts to whatever you record.",
      s=["v:grilleGlint:4", "v:xrayFront:4"]),
 # DROP 1 ───────────────────────────────────────────────────────────────────
 dict(b=8, ch=1, t="NEUMANN TLM 107", e="TLM 107", h="Neumann TLM 107.",
      x="A multi-pattern large-diaphragm studio condenser, designed and built in Germany.",
      s=["c:black_front:2:reveal", "c:nickel_front:2", "c:black_front_tall:2", "c:nickel_front_tall:2"]),
 dict(b=8, ch=1, t="IN NICKEL", e="NICKEL", h="In nickel.",
      x="Classic Neumann nickel, bright and timeless, with the red rhombus badge.",
      s=["c:nickel_ea4:2", "i:nickel_grille_macro:2", "i:nickel_xlr_macro:2", "c:nickel_ea4_b:2"]),
 dict(b=8, ch=1, t="OR IN BLACK", e="BLACK", h="Or in black.",
      x="Sleek and discreet, for stages, cameras and dark control rooms.",
      s=["c:black_ea4:2", "i:grille_badge_dark:2", "c:black_xlr_angle:2", "i:black_ea4_brand:2"]),
 dict(b=8, ch=1, t="FIVE POLAR PATTERNS", e="FIVE", h="Five polar patterns.",
      x="Omni, wide cardioid, cardioid, hypercardioid and figure-eight, in one capsule.",
      s=["z:polar5:8"]),
 dict(b=8, ch=1, t="141 dB SPL", e="141", h="One hundred forty-one decibels.",
      x="Maximum SPL, before you even touch the two-stage pad.",
      s=["z:spl:8:141"]),
 dict(b=8, ch=1, t="10 dB-A SELF-NOISE", e="10 dB-A", h="Ten dB-A self-noise.",
      x="Quieter than the ambient noise of a very quiet studio.",
      s=["z:noisefloor:8"]),
 dict(b=8, ch=1, t="BUT HOW?", e="HOW?", h="But how?",
      x="The answer is inside. Let's open it up, piece by piece.",
      s=["v:xrayRot:4", "v:xrayFront:4"]),
 # BREAKDOWN — INSIDE ───────────────────────────────────────────────────────
 dict(b=12, ch=2, t="THE CAPSULE", e="CAPSULE", h="The capsule.",
      x="Two diaphragms, face to face. Combining their two signals is how one capsule produces five different polar patterns.",
      s=["v:capsule:4", "z:dual:8"]),
 dict(b=12, ch=2, t="TRANSFORMERLESS", e="TRANSFORMERLESS", h="Transformerless.",
      x="No output transformer in the path, so the sound stays open and transparent, with full, deep, unrestricted bass.",
      s=["v:pcb:4", "z:signal:8"]),
 dict(b=8, ch=2, t="EVEN AT THE HIGHEST LEVELS", e="HIGHEST", h="Even at the highest levels.",
      x="The low end stays solid, clean and unforced.",
      s=["i:grille_abstract:4", "i:black_leds_macro:4"]),
 dict(b=12, ch=2, t="20 Hz – 20 kHz", e="20 kHz", h="Twenty hertz to twenty kilohertz.",
      x="An extended, carefully balanced frequency response, consistent across every one of the five polar patterns.",
      s=["v:freq:4", "z:freq:8"]),
 dict(b=12, ch=2, t="MORE NEUTRAL THAN THE TLM 103", e="NEUTRAL", h="More neutral than the TLM 103.",
      x="Less presence hype and more honest truth, so your mix needs less fixing later.",
      s=["c:nickel_front_tall:4", "i:nickel_console:4", "i:nickel_purple:4"]),
 dict(b=8, ch=2, t="11 mV/Pa", e="11", h="Eleven millivolts per pascal.",
      x="Strong output, so your preamp stays calm and quiet.",
      s=["z:sens:8"]),
 # BUILD + VERSE — PATTERNS ─────────────────────────────────────────────────
 dict(b=8, ch=3, t="ONE BECOMES FIVE", e="FIVE", h="Now, one becomes five.",
      x="Watch the pickup pattern reshape itself, press by press.",
      s=["v:xrayFront:4", "v:polarRings:4"]),
 dict(b=8, ch=3, t="OMNIDIRECTIONAL", e="OMNI", h="Omnidirectional.",
      x="Equal pickup all around, for rooms, choirs, ensembles and the natural ambience.",
      s=["z:polar:8:omni"]),
 dict(b=8, ch=3, t="WIDE CARDIOID", e="WIDE", h="Wide cardioid.",
      x="A gentle forward focus that still lets the whole room breathe.",
      s=["z:polar:8:wide"]),
 dict(b=8, ch=3, t="CARDIOID", e="CARDIOID", h="Cardioid.",
      x="The classic vocal pattern, focused forward and rejecting the room behind it.",
      s=["z:polar:8:cardioid"]),
 dict(b=8, ch=3, t="HYPERCARDIOID", e="HYPER", h="Hypercardioid.",
      x="Tighter still, to isolate one source on a loud and busy stage.",
      s=["z:polar:8:hyper"]),
 dict(b=8, ch=3, t="FIGURE-8", e="FIGURE-8", h="Figure-eight.",
      x="Front and back, deaf at the sides, for duets and mid-side stereo.",
      s=["z:polar:8:fig8"]),
 dict(b=8, ch=3, t="ALL FROM ONE SWITCH", e="ONE", h="All from one switch.",
      x="The navigation switch sets pattern, pad and low cut.",
      s=["v:navSwitch:8"]),
 # DROP — CONTROL ───────────────────────────────────────────────────────────
 dict(b=8, ch=3, t="PUSH. SELECT. DONE.", e="DONE.", h="Push, select, done.",
      x="Step through the settings, and the LEDs confirm each change.",
      s=["z:switch:8:patterns"]),
 dict(b=8, ch=3, t="THE ILLUMINATED RING", e="RING", h="The illuminated ring.",
      x="Your pattern glows in the chrome ring, at a glance.",
      s=["i:nickel_ring_macro:2", "i:black_ring_macro:2", "v:nickelSide:2", "i:black_leds_macro2:2"]),
 dict(b=8, ch=3, t="PAD · −6 / −12 dB", e="PAD", h="Two-stage pad.",
      x="Minus six or minus twelve decibels, shown by the left-hand LEDs.",
      s=["z:switch:8:pad"]),
 dict(b=8, ch=3, t="UP TO 153 dB", e="153", h="Up to one hundred fifty-three decibels.",
      x="With full pad, for the loudest sources.",
      s=["z:spl:8:pad"]),
 dict(b=8, ch=3, t="LOW CUT · 40 · 100 Hz", e="LOW CUT", h="Two low-cut filters.",
      x="Forty hertz, below the double bass. One hundred, for voice.",
      s=["z:lowcut:8"]),
 dict(b=8, ch=3, t="THEN IT GOES DARK", e="DARK", h="Then it goes dark.",
      x="After fifteen seconds, the display turns off, for discretion.",
      s=["z:switch:8:autooff"]),
 dict(b=8, ch=3, t="SETTINGS YOU CAN TRUST", e="TRUST", h="Settings you can trust.",
      x="Visible when you need them, invisible when you don't.",
      s=["v:badges:4", "i:grille_badge_dark2:2", "i:badge_black_macro2:2"]),
 # BUILD — SPEC & KIT ───────────────────────────────────────────────────────
 dict(b=12, ch=4, t="THE NUMBERS", e="NUMBERS", h="The numbers.",
      x="Eleven millivolts per pascal, ten dB-A self-noise, one thirty-one dB dynamic range, and twenty hertz to twenty kilohertz.",
      s=["z:specs:12"]),
 dict(b=8, ch=4, t="445 g · 64 × 145 mm", e="445 g", h="Four hundred forty-five grams.",
      x="Sixty-four by one forty-five millimetres, compact yet reassuringly solid.",
      s=["z:dims:8"]),
 dict(b=12, ch=4, t="THE STUDIO SET", e="STUDIO SET", h="The Studio Set.",
      x="The TLM 107 with the EA 4 elastic mount against stand-borne noise, delivered in a wooden case.",
      s=["c:mount_black:2", "c:mount_nickel:2", "c:mount_nickel_parts:2", "c:cream_ea4:2", "i:box_open_black:2", "i:box_closed:1", "i:box_trio:1"]),
 dict(b=8, ch=4, t="48 V PHANTOM", e="48 V", h="Standard forty-eight volt phantom.",
      x="Any good preamp or audio interface can power it.",
      s=["i:nickel_xlr_macro:4", "c:black_xlr_angle:4"]),
 # DROP 2 — IN USE ──────────────────────────────────────────────────────────
 dict(b=8, ch=4, t="IN THE STUDIO", e="STUDIO", h="Now, in the studio.",
      x="One mic, every session, first vocal to final overdub.",
      s=["c:nickel_ea4_stand:2:reveal", "c:white_ea4:2", "i:nickel_console:2", "c:black_ea4_stand:2"]),
 dict(b=8, ch=4, t="VOCALS", e="VOCALS", h="Vocals.",
      x="Intimate, detailed and honest, with the hundred hertz filter keeping it clean.",
      s=["i:nickel_purple:4", "c:nickel_clip_angle:2", "c:nickel_stand:2"]),
 dict(b=8, ch=4, t="ACOUSTIC GUITAR", e="GUITAR", h="Acoustic guitar.",
      x="Every string, every pick attack, body and air, in natural balance.",
      s=["v:guitar:4", "i:grille_badge_dark:2", "c:black_front:2"]),
 dict(b=8, ch=4, t="DRUMS & PERCUSSION", e="DRUMS", h="Drums and percussion.",
      x="Congas, kick drum and overheads, all with headroom to spare.",
      s=["v:congas:4", "i:badge_black_macro2:2", "i:grille_badge_dark2:2"]),
 dict(b=8, ch=4, t="THE CONTROL ROOM", e="CONTROL", h="In the control room.",
      x="Every take arrives clean, balanced and ready to mix.",
      s=["v:console:4", "m:homestudio:4"]),
 dict(b=8, ch=4, t="ORCHESTRAS & ENSEMBLES", e="ORCHESTRAS", h="Orchestras and ensembles.",
      x="Switch to omni or figure-eight, and capture the whole hall.",
      s=["v:orchestra:4", "i:polar_chart:4"]),
 dict(b=8, ch=4, t="PODCASTS & VOICE-OVER", e="PODCASTS", h="Podcasts and voice-over.",
      x="Clear, close speech, with self-noise far below the room itself.",
      s=["i:black_ea4_brand:4", "c:black_front_tall:4"]),
 dict(b=8, ch=4, t="HOME STUDIOS", e="HOME", h="Home studios.",
      x="One premium mic that covers everything, instead of owning five compromises.",
      s=["i:black_homestudio:4", "c:black_ea4:4"]),
 dict(b=8, ch=4, t="COMPLETE THE CHAIN", e="CHAIN", h="Complete the chain.",
      x="Pair it with Neumann monitors and headphones, capsule to speaker.",
      s=["z:ecosystem:8"]),
 dict(b=8, ch=4, t="AWARD-WINNING", e="AWARD-WINNING", h="Award-winning.",
      x="Best of Show at AES twenty-thirteen, and a TEC Award in twenty-fourteen.",
      s=["z:awards:8"]),
 dict(b=9, ch=4, t="WHICH ONE IS YOURS?", e="YOURS?", h="Which one is yours?",
      x="Nickel or black? Hear it in person, and tell us below.",
      s=["v:badges:3", "c:nickel_ea4:3", "c:black_ea4:3"]),
 # OUTRO — 9.933 s (290.067 -> 300.000, on the beat): logos, partner line,
 # numbers, website, socials
 dict(end=True, ch=4, t="", e="", h="",
      x="Shivansh Electronics is the Exclusive Partner of the Neumann TLM 107 Studio Set. Call the numbers on screen, and follow us today.",
      s=["z:outro:end"]),
]

REEL_SECONDS, FILM_SECONDS = 180.0, 300.0
FILM_PICKUP = 1.4          # the song's first downbeat
FILM_OUTRO = 290.0667     # outro (end screen) start, on the beat; runs to 300.000


def words(w):
    return len((w["h"] + " " + w["x"]).split())


def timed(film):
    """Returns [(start, end, window)] in seconds for one film."""
    out, t = [], 0.0
    lines = REEL if film == "reel" else FILM
    total = REEL_SECONDS if film == "reel" else FILM_SECONDS
    for w in lines:
        if w.get("end"):
            a, b = t, total
        else:
            a = t
            b = t + w["b"] * BEAT + (FILM_PICKUP if w.get("pickup") else 0.0)
        out.append((round(a, 4), round(b, 4), w))
        t = b
    if film == "reel":
        assert abs(out[-1][1] - total) < 1e-3, out[-1]
    return out


def check(verbose=True):
    ok = True
    for film, total in (("reel", REEL_SECONDS), ("film", FILM_SECONDS)):
        tw = 0
        for a, b, w in timed(film):
            n = words(w)
            cap = math.floor((b - a) * WPM / 60)
            tw += n
            flag = "" if n <= cap else "  << OVER"
            if n > cap:
                ok = False
            if verbose:
                print(f"{film} {a:7.2f}-{b:7.2f} {n:3d}/{cap:3d} {(n / (b - a) * 60):5.1f}wpm  {w['t']}{flag}")
        if verbose:
            print(f"{film}: {tw} words / {total:.0f} s = {tw / total * 60:.1f} wpm\n")
    return ok


if __name__ == "__main__":
    assert check(), "a window exceeds 152 wpm"

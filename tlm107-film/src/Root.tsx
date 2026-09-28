import React from "react";
import { Composition, Still } from "remotion";
import { Film } from "./Film.tsx";
import { ThumbFilm, ThumbReel } from "./Thumbnail.tsx";
import { FILM, REEL } from "./theme.ts";
import { loadFonts } from "./fonts.ts";

// Compositions are laid out at 1080p and rendered with --scale=2, which
// rasterises every frame natively at 4K (2160 x 3840 and 3840 x 2160).
export const RemotionRoot: React.FC = () => {
  loadFonts();
  return (
    <>
      <Composition id="Reel" component={Film} defaultProps={{ name: "reel" as const, audio: false }} width={REEL.w} height={REEL.h} fps={REEL.fps} durationInFrames={REEL.frames} />
      <Composition id="Film" component={Film} defaultProps={{ name: "film" as const, audio: false }} width={FILM.w} height={FILM.h} fps={FILM.fps} durationInFrames={FILM.frames} />
      <Still id="ThumbReel" component={ThumbReel} width={REEL.w} height={REEL.h} />
      <Still id="ThumbFilm" component={ThumbFilm} width={FILM.w} height={FILM.h} />
    </>
  );
};

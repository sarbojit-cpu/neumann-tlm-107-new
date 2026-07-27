import React, { useEffect, useState } from "react";
import { Composition, continueRender, delayRender } from "remotion";
import { MainReel } from "./MainReel";
import { Thumbnail } from "./Thumbnail";
import { VIDEO } from "./theme";
import { TOTAL_FRAMES } from "./schedule";
import { FONT_FACE_CSS, loadFonts } from "./fonts";
import { LongForm } from "./longform/LongForm";
import { LF_VIDEO } from "./longform/theme";
import { LF_TOTAL_FRAMES } from "./longform/schedule";
import { ThumbnailLongform } from "./longform/ThumbnailLongform";
import type { ThumbLang } from "./components/LanguageBadge";

/** Injects @font-face + blocks render until both fonts are fully loaded. */
const WaitForFonts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    loadFonts()
      .then(() => continueRender(handle))
      .catch(() => continueRender(handle));
  }, [handle]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FONT_FACE_CSS }} />
      {children}
    </>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainReel"
        component={() => (
          <WaitForFonts>
            <MainReel />
          </WaitForFonts>
        )}
        durationInFrames={TOTAL_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Thumbnail"
        component={() => (
          <WaitForFonts>
            <Thumbnail />
          </WaitForFonts>
        )}
        durationInFrames={60}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="LongForm"
        component={() => (
          <WaitForFonts>
            <LongForm />
          </WaitForFonts>
        )}
        durationInFrames={LF_TOTAL_FRAMES}
        fps={LF_VIDEO.fps}
        width={LF_VIDEO.width}
        height={LF_VIDEO.height}
      />

      {/* Reel thumbnails (1080x1920) — English / Hindi / Bengali audio-language variants */}
      {(["english", "hindi", "bengali"] as ThumbLang[]).map((lang) => (
        <Composition
          key={`reel-thumb-${lang}`}
          id={`ThumbnailReel-${cap(lang)}`}
          component={() => (
            <WaitForFonts>
              <Thumbnail lang={lang} />
            </WaitForFonts>
          )}
          durationInFrames={60}
          fps={VIDEO.fps}
          width={VIDEO.width}
          height={VIDEO.height}
        />
      ))}

      {/* Long-form thumbnails (1920x1080) — English / Hindi / Bengali audio-language variants */}
      {(["english", "hindi", "bengali"] as ThumbLang[]).map((lang) => (
        <Composition
          key={`longform-thumb-${lang}`}
          id={`ThumbnailLongform-${cap(lang)}`}
          component={() => (
            <WaitForFonts>
              <ThumbnailLongform lang={lang} />
            </WaitForFonts>
          )}
          durationInFrames={60}
          fps={LF_VIDEO.fps}
          width={LF_VIDEO.width}
          height={LF_VIDEO.height}
        />
      ))}
    </>
  );
};

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

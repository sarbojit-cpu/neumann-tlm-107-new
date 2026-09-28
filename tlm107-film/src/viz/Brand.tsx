import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ASSETS } from "../assets.generated.ts";
import { C, CONTACT, FONT } from "../theme.ts";
import { clamp, easeOutBack, easeOutCubic, easeOutExpo, lerp } from "../lib/ease.ts";
import { Stage } from "../shots/Stage.tsx";
import { Mono, type VizProps } from "./Shell.tsx";

// ─────────────────────────────────────────────────────────────────────────────
// THE OUTRO — 6 s on the reel, 10 s on the film. The only place any dealer
// mark, number, website or handle appears.
//
//   the two marks        Neumann · Shivansh Electronics, knocked out to white
//   the partner line     "Shivansh Electronics is the Exclusive Partner of the
//                         Neumann TLM 107 Studio Set" — no zone, no region
//   the Studio Set       nickel and black TLM 107 in their EA 4 mounts, lit
//   the glass panel      three numbers, the website, four social handles
//
// Everything has landed by ~2.5 s and then holds, so a viewer can pause on
// any frame after that and read all of it.
// ─────────────────────────────────────────────────────────────────────────────

export const Icon: React.FC<{ kind: string; size: number }> = ({ kind, size }) => {
  const col: Record<string, string> = { web: "#2F6FE0", wa: "#1FAF5A", instagram: "#C13584", facebook: "#1877F2", youtube: "#E62117", linkedin: "#0A66C2" };
  const glyph: Record<string, React.ReactNode> = {
    web: <><circle cx="12" cy="12" r="8" fill="none" stroke="#fff" strokeWidth="1.8" /><path d="M4 12h16M12 4c3 3 3 13 0 16M12 4c-3 3-3 13 0 16" fill="none" stroke="#fff" strokeWidth="1.5" /></>,
    wa: <><path d="M12 4.5a7.5 7.5 0 0 0-6.5 11.2L4.5 19.5l3.9-1a7.5 7.5 0 1 0 3.6-14z" fill="none" stroke="#fff" strokeWidth="1.7" /><path d="M9.3 8.8c.3 2.6 2.4 4.9 5.2 5.4l1-1.2-1.6-.8-.7.7c-1-.4-1.9-1.3-2.3-2.3l.7-.7-.8-1.6z" fill="#fff" /></>,
    instagram: <><rect x="5" y="5" width="14" height="14" rx="4" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="12" cy="12" r="3.3" fill="none" stroke="#fff" strokeWidth="1.8" /><circle cx="16.3" cy="7.7" r="1" fill="#fff" /></>,
    facebook: <path d="M13.2 19v-6h2.1l.3-2.5h-2.4V9c0-.7.2-1.2 1.2-1.2h1.3V5.6c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v1.8H8.5V13h2.1v6z" fill="#fff" />,
    youtube: <><rect x="4" y="7" width="16" height="10" rx="3" fill="none" stroke="#fff" strokeWidth="1.8" /><path d="M10.5 9.8v4.4l3.8-2.2z" fill="#fff" /></>,
    linkedin: <><rect x="6" y="10" width="2.6" height="8" fill="#fff" /><circle cx="7.3" cy="7.1" r="1.5" fill="#fff" /><path d="M10.6 10h2.5v1.2c.4-.7 1.3-1.4 2.6-1.4 2.3 0 2.8 1.5 2.8 3.4V18H16v-4.2c0-1-.1-2.1-1.4-2.1s-1.6 1-1.6 2.1V18h-2.4z" fill="#fff" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none", filter: `drop-shadow(0 0 8px ${col[kind]}66)` }}>
      <rect width="24" height="24" rx="6" fill={col[kind] ?? "#333"} />
      {glyph[kind]}
    </svg>
  );
};

const Row: React.FC<{ q: number; children: React.ReactNode; gap?: number }> = ({ q, children, gap = 16 }) => (
  <div style={{ display: "flex", alignItems: "center", gap, opacity: q, transform: `translateY(${(1 - q) * 18}px)`, filter: q < 1 ? `blur(${(1 - q) * 6}px)` : undefined }}>{children}</div>
);

export const Outro: React.FC<VizProps> = ({ f, canvas, glow, beatF }) => {
  const P = canvas.portrait;
  const W = canvas.w, H = canvas.h;
  const at = (b: number, d = 12) => easeOutCubic(clamp((f - b * beatF) / d));
  const slam = easeOutBack(clamp(f / 14), 1.5);
  const nick = ASSETS["nickel_ea4"], blk = ASSETS["black_ea4"];
  const push = lerp(1, 1.035, clamp(f / (P ? 180 : 298)));

  // ── layout ──
  const floorY = P ? 1010 : 930;
  const ph = P ? 420 : 580;
  const stageX = P ? W / 2 : 460;
  const nw = nick ? ph * nick.ar : ph * 0.7;
  const bw = blk ? ph * 0.97 * blk.ar : ph * 0.7;
  const rise = at(0.5, 18);

  const markH = P ? 58 : 58;
  const shivH = P ? 104 : 92;
  const colX = P ? 70 : 900;
  const colW = P ? W - 140 : 900;
  const fsMono = P ? 29 : 23;
  const fsNum = P ? 34 : 27;
  const ink = "rgba(240,244,248,0.96)";

  const Marks = (
    <div style={{ display: "flex", alignItems: "center", justifyContent: P ? "center" : "flex-start", gap: P ? 34 : 38, transform: `scale(${lerp(0.86, 1, slam)})`, opacity: clamp(slam * 1.6), filter: `blur(${(1 - clamp(slam)) * 8}px)`, transformOrigin: P ? "50% 50%" : "0% 50%" }}>
      <Img src={staticFile("img/logo_neumann_w.png")} style={{ height: markH, width: "auto" }} />
      <div style={{ width: 2, height: shivH * 0.9, background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.55), transparent)" }} />
      <Img src={staticFile("img/logo_shivansh_w.png")} style={{ height: shivH, width: "auto" }} />
    </div>
  );

  const Partner = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: P ? "center" : "flex-start", textAlign: P ? "center" : "left", gap: P ? 8 : 6 }}>
      <Row q={at(0.5)}>
        <Mono size={P ? 21 : 20} color="rgba(230,236,242,0.85)" weight={700} ls={P ? 3 : 4}>
          <span style={{ color: C.red }}>◆</span> {CONTACT.role.toUpperCase()}
        </Mono>
      </Row>
      <div style={{ opacity: at(1, 14), transform: `translateY(${(1 - at(1, 14)) * 20}px)` }}>
        <span style={{ fontFamily: FONT.serif, fontStyle: "italic", fontSize: P ? 84 : 74, lineHeight: 1.02, color: "#F6FAFF", textShadow: `0 0 36px rgba(225,38,63,${0.2 + 0.15 * glow})` }}>
          {P ? <>Neumann TLM 107<br />Studio Set</> : CONTACT.role2}
        </span>
      </div>
      <svg width={P ? 520 : 600} height={16} style={{ overflow: "visible", opacity: at(1.2) }}>
        <path d={`M 0 8 L ${(P ? 520 : 600) * easeOutExpo(at(1.2, 18))} 8`} stroke={C.redHot} strokeWidth={3} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${C.red})` }} transform={P ? `translate(${((1 - easeOutExpo(at(1.2, 18))) * 520) / 2} 0)` : undefined} />
      </svg>
    </div>
  );

  const Panel = (
    <div style={{ width: colW, boxSizing: "border-box", padding: P ? "30px 34px" : "28px 34px", borderRadius: 26, background: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.035) 60%, rgba(255,255,255,0.06) 100%)", border: "1.5px solid rgba(230,236,242,0.24)", boxShadow: `0 40px 90px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.22), 0 0 ${30 * glow}px rgba(190,236,255,0.12)`, opacity: at(1.4, 10), display: "flex", flexDirection: "column", gap: P ? 20 : 16 }}>
      <Row q={at(1.6)}>
        <Icon kind="wa" size={fsNum + 14} />
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Mono size={P ? 15 : 14} color="rgba(230,236,242,0.6)" ls={4}>CALL · WHATSAPP</Mono>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: P ? 22 : 26, rowGap: 4 }}>
            {CONTACT.whatsapp.map((n) => <span key={n} style={{ fontFamily: FONT.mono, fontSize: fsNum, fontWeight: 700, color: ink, letterSpacing: 0.5 }}>{n}</span>)}
          </div>
        </div>
      </Row>
      <Row q={at(2)}>
        <Icon kind="web" size={fsMono + 12} />
        <span style={{ fontFamily: FONT.mono, fontSize: fsMono + 2, fontWeight: 700, color: ink }}>{CONTACT.site}</span>
      </Row>
      <div style={{ height: 1, background: "linear-gradient(90deg, rgba(230,236,242,0.3), rgba(230,236,242,0))", opacity: at(2.2) }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", rowGap: P ? 14 : 10, columnGap: 22 }}>
        {CONTACT.social.map(([k, url], i) => (
          <Row key={k} q={at(2.4 + i * 0.3)} gap={14}>
            <Icon kind={k} size={fsMono + 10} />
            <span style={{ fontFamily: FONT.mono, fontSize: P ? fsMono - 1 : fsMono, fontWeight: 600, color: ink, whiteSpace: "nowrap" }}>{url}</span>
          </Row>
        ))}
      </div>
    </div>
  );

  return (
    <AbsoluteFill>
      <Stage w={W} h={H} f={f} px={0} py={0} floorY={floorY} glow={glow} tint="red" />
      <AbsoluteFill style={{ transform: `scale(${push})` }}>
        {/* the Studio Set */}
        {nick ? <Img src={staticFile(nick.file)} style={{ position: "absolute", left: stageX - nw + (P ? 10 : 30), top: floorY - ph + (1 - rise) * 80, width: nw, height: ph, opacity: rise }} /> : null}
        {blk ? <Img src={staticFile(blk.file)} style={{ position: "absolute", left: stageX - (P ? 10 : 30), top: floorY - ph * 0.97 + (1 - rise) * 110, width: bw, height: ph * 0.97, opacity: rise }} /> : null}
        <div style={{ position: "absolute", left: stageX - 260, top: floorY + 18, width: 520, textAlign: "center", opacity: at(1) }}>
          <Mono size={P ? 16 : 15} color="rgba(230,236,242,0.55)" ls={4}>TLM 107 STUDIO SET · NICKEL / BLACK</Mono>
        </div>
        {P ? (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 172, display: "flex", justifyContent: "center" }}>{Marks}</div>
            <div style={{ position: "absolute", left: 60, right: 60, top: 340, display: "flex", justifyContent: "center" }}>{Partner}</div>
            <div style={{ position: "absolute", left: colX, top: 1068 }}>{Panel}</div>
          </>
        ) : (
          <div style={{ position: "absolute", left: colX, top: 70, width: colW, display: "flex", flexDirection: "column", gap: 28 }}>
            {Marks}
            {Partner}
            {Panel}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

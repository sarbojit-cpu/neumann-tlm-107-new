import { Config } from "@remotion/cli/config";

// Frames are designed at 1080p and rendered with --scale=2, so every glyph,
// vector and photograph is rasterised natively at 2160 x 3840 / 3840 x 2160.
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(94);
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("swiftshader");
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell");
Config.setConcurrency(3);
Config.setDelayRenderTimeoutInMilliseconds(120000);

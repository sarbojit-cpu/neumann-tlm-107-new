import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
// High quality H.264 output tuned for social platforms.
Config.setCodec("h264");
Config.setCrf(18);
Config.setPixelFormat("yuv420p");
// Chromium flags help headless rendering stability in constrained containers.
Config.setChromiumDisableWebSecurity(false);

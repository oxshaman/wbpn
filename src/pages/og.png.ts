import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

const COL_BG = "#f8f7f4";
const COL_NAVY = "#1a1a2e";
const COL_MUTED = "#6b6b80";
const COL_BORDER = "#e2e0db";
const COL_MINT = "#a8e6cf";
const COL_LAVENDER = "#c3b1e1";
const COL_PEACH = "#ffd6a5";
const COL_CORAL = "#ffb3b3";

async function loadFont(): Promise<ArrayBuffer> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Sora:wght@700&display=swap",
  ).then((r) => r.text());
  const fontUrl = css.match(/src:\s*url\((.+?)\)/)?.[1];
  if (!fontUrl) throw new Error("Could not resolve Sora font URL");
  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

let fontCache: ArrayBuffer | null = null;

export const GET: APIRoute = async () => {
  if (!fontCache) fontCache = await loadFont();

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px 100px",
          backgroundColor: COL_BG,
          fontFamily: "Sora",
          position: "relative",
          overflow: "hidden",
        },
        children: [
          // Grid pattern overlay (subtle lines)
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `linear-gradient(${COL_BORDER}40 1px, transparent 1px), linear-gradient(90deg, ${COL_BORDER}40 1px, transparent 1px)`,
                backgroundSize: "72px 72px",
              },
            },
          },
          // Mint accent blob
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-120px",
                right: "-80px",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background: COL_MINT,
                opacity: 0.15,
                filter: "blur(80px)",
              },
            },
          },
          // Lavender accent blob
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-100px",
                left: "30%",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background: COL_LAVENDER,
                opacity: 0.12,
                filter: "blur(80px)",
              },
            },
          },
          // Logo row
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "40px",
                position: "relative",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexWrap: "wrap",
                      width: "44px",
                      height: "44px",
                      gap: "4px",
                    },
                    children: [
                      { type: "div", props: { style: { width: "20px", height: "20px", borderRadius: "3px", background: COL_MINT } } },
                      { type: "div", props: { style: { width: "20px", height: "20px", borderRadius: "3px", background: COL_LAVENDER } } },
                      { type: "div", props: { style: { width: "20px", height: "20px", borderRadius: "3px", background: COL_PEACH } } },
                      { type: "div", props: { style: { width: "20px", height: "20px", borderRadius: "3px", background: COL_CORAL } } },
                    ],
                  },
                },
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: "18px",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: COL_NAVY,
                    },
                    children: "WBPS",
                  },
                },
              ],
            },
          },
          // Title
          {
            type: "div",
            props: {
              style: {
                fontSize: "56px",
                fontWeight: 700,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                color: COL_NAVY,
                marginBottom: "24px",
                maxWidth: "800px",
                position: "relative",
              },
              children: "Seamless payments across the Western Balkans",
            },
          },
          // Subtitle
          {
            type: "div",
            props: {
              style: {
                fontSize: "20px",
                lineHeight: 1.6,
                color: COL_MUTED,
                maxWidth: "620px",
                position: "relative",
              },
              children:
                "Stablecoin-powered payment infrastructure — fast, transparent, and built for the region.",
            },
          },
          // Bottom bar
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "0",
                left: "0",
                right: "0",
                height: "4px",
                display: "flex",
              },
              children: [
                { type: "div", props: { style: { flex: 1, background: COL_MINT } } },
                { type: "div", props: { style: { flex: 1, background: COL_LAVENDER } } },
                { type: "div", props: { style: { flex: 1, background: COL_PEACH } } },
                { type: "div", props: { style: { flex: 1, background: COL_CORAL } } },
              ],
            },
          },
        ],
      },
    },
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Sora",
          data: fontCache,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
};

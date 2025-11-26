import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AuthorStack",
    short_name: "AuthorStack",
    description:
      "The all-in-one dashboard for indie authors. Track sales, analyze revenue, and grow your book business.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#722F37",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/logos/Light_logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logos/Light_logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

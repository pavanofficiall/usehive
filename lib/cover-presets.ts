export const coverPresets = [
  { name: "Blue sky", src: "/blue-sky.jpg" },
  { name: "Blue horizon", src: "/blog-presets/blue-horizon.jpg" },
  { name: "Sunrise", src: "/blog-presets/sunrise.jpg" },
  { name: "Rose", src: "/blog-presets/rose.jpg" },
  { name: "Prism", src: "/blog-presets/prism.jpg" },
  { name: "Soft glow", src: "/blog-presets/soft-glow.jpg" },
  { name: "Beta gradient", src: "/beta-launch-gradient.jpg" },
  { name: "Color thumbnail", src: "/blog-presets/colorblogpostthumbnail.jpg" },
] as const;

export const isCoverPreset = (value: string) => coverPresets.some(preset => preset.src === value);

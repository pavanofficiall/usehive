"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
export const fonts = ["Geist", "Inter", "Manrope", "DM Sans", "Plus Jakarta Sans", "Sora", "Outfit", "Urbanist", "Albert Sans", "Figtree", "Onest", "Instrument Sans", "Hanken Grotesk", "Space Grotesk", "Work Sans", "Public Sans", "IBM Plex Sans", "Barlow", "Source Sans 3", "Raleway"];
export function FontSwitcher() {
  const [index, setIndex] = useState(0);
  useEffect(() => { const saved = localStorage.getItem("hive-font"); const found = fonts.indexOf(saved || ""); if (found >= 0) setIndex(found); }, []);
  useEffect(() => {
    const name = fonts[index]; const slug = name.toLowerCase().replaceAll(" ", "-");
    if (!document.getElementById(`font-${slug}`)) { const link = document.createElement("link"); link.id = `font-${slug}`; link.rel = "stylesheet"; link.href = `/fonts/${slug}.css`; document.head.appendChild(link); }
    document.documentElement.style.setProperty("--font-site", `"${name}", Arial, sans-serif`);
    localStorage.setItem("hive-font", name);
  }, [index]);
  return <div className="font-lab" aria-label="Font preview"><button aria-label="Previous font" onClick={() => setIndex((index + 19) % 20)}><ChevronLeft size={15}/></button><Select value={String(index)} onValueChange={value => setIndex(Number(value))}><SelectTrigger className="font-select" aria-label="Choose preview font"><SelectValue/></SelectTrigger><SelectContent>{fonts.map((name, i) => <SelectItem key={name} value={String(i)}>{String(i + 1).padStart(2, "0")} / {name}</SelectItem>)}</SelectContent></Select><button aria-label="Next font" onClick={() => setIndex((index + 1) % 20)}><ChevronRight size={15}/></button></div>;
}

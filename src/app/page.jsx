import { ToneShiftApp } from "@/components/ToneShiftApp";

export const metadata = {
  title: "ToneShift — Text Tone Transformer",
  description:
    "Transform any text into LinkedIn, Reddit, Instagram, Twitter, Blog, Email and more — no AI API, 100% rule-based.",
  keywords: ["tone changer", "text transformer", "linkedin post", "writing style", "text rewriter"],
};

export default function Home() {
  return <ToneShiftApp />;
}

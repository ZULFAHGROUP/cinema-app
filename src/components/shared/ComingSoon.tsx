import { Sparkles } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

const ComingSoon = ({ title, description }: ComingSoonProps) => (
  <div className="bg-white rounded-2xl border border-[#e6dfd3] p-12 text-center shadow-[0_1px_2px_rgba(18,22,28,0.05)]">
    <span className="eyebrow-chip mx-auto mb-3">In Roadmap</span>
    <div className="w-11 h-11 rounded-xl bg-[#fff8ea] border border-[#e6dfd3] flex items-center justify-center text-[#c77e3b] mx-auto mb-3">
      <Sparkles className="w-5 h-5" />
    </div>
    <h3 className="font-display text-lg font-bold text-[#12161c]">{title}</h3>
    {description && (
      <p className="text-xs text-stone-500 max-w-md mx-auto mt-1.5 leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

export default ComingSoon;

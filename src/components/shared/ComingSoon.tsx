import { Sparkles } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

/** Placeholder for features the API doesn't support yet, instead of sample data. */
const ComingSoon = ({ title, description }: ComingSoonProps) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-[#c77e3b]/30 rounded-2xl bg-gradient-to-b from-white to-[#fff8ea]/50">
    <div className="p-4 rounded-2xl bg-[#fff8ea] border border-[#c77e3b]/20 mb-4 shadow-2xs">
      <Sparkles className="w-7 h-7 text-[#c77e3b]" />
    </div>
    <span className="px-3 py-1 rounded-full bg-[#c77e3b]/10 text-[#c77e3b] text-xs font-bold uppercase tracking-wider mb-2">
      In Roadmap
    </span>
    <h3 className="text-xl font-bold text-stone-900">{title} is coming soon</h3>
    {description && (
      <p className="text-sm text-stone-500 mt-2 max-w-md leading-relaxed">
        {description}
      </p>
    )}
  </div>
);

export default ComingSoon;

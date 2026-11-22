import { Clock } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

/** Placeholder for features the API doesn't support yet, instead of sample data. */
const ComingSoon = ({ title, description }: ComingSoonProps) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed rounded-lg bg-gray-50">
    <div className="p-3 rounded-full bg-[#fff8ea] mb-4">
      <Clock className="w-8 h-8 text-[#c77e3b]" />
    </div>
    <h3 className="text-lg font-sans font-semibold">{title} is coming soon</h3>
    {description && (
      <p className="text-sm text-muted-foreground font-serif mt-2 max-w-md">{description}</p>
    )}
  </div>
);

export default ComingSoon;

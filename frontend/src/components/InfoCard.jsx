import { Info } from "lucide-react";

const InfoCard = () => {
  return (
    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 flex gap-3 mb-6">
      <Info className="text-purple-500 mt-1" size={16} />
      <p className="text-sm text-gray-600 leading-relaxed">
        Staying within this limit helps you stay focused and prevents overwhelm.
        The rest can wait — or be delegated.
      </p>
    </div>
  );
};

export default InfoCard;
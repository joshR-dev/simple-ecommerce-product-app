import type { SizeOption } from "~/types/product";
import "./size-selector.css";

interface SizeSelectorProps {
  options: SizeOption[];
  selectedSize: string | null;
  onSelect: (label: string) => void;
}

export function SizeSelector({
  options,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="size-selector">
      {options.map((option) => (
        <button
          key={option.id}
          className={`size-option ${selectedSize === option.label ? "size-option-selected" : ""}`}
          onClick={() => onSelect(option.label)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

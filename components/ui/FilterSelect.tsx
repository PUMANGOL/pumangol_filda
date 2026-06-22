"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { cn } from "@/lib/utils";

const ALL_VALUE = "__all__";

type FilterSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  allLabel: string;
  options: readonly string[];
  className?: string;
};

export function FilterSelect({
  value,
  onValueChange,
  allLabel,
  options,
  className,
}: FilterSelectProps) {
  return (
    <Select
      value={value || ALL_VALUE}
      onValueChange={(next) => onValueChange(next === ALL_VALUE ? "" : next)}
    >
      <SelectTrigger
        size="sm"
        className={cn("w-full bg-white sm:min-w-[11rem] sm:w-auto", className)}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

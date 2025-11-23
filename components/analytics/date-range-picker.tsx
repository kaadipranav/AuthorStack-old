"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface DateRangePickerProps {
  startDate?: Date;
  endDate?: Date;
  onRangeChange: (start: Date | undefined, end: Date | undefined) => void;
}

export function DateRangePicker({ startDate, endDate, onRangeChange }: DateRangePickerProps) {
  const [localStart, setLocalStart] = useState<string>(
    startDate ? format(startDate, "yyyy-MM-dd") : ""
  );
  const [localEnd, setLocalEnd] = useState<string>(endDate ? format(endDate, "yyyy-MM-dd") : "");

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalStart(e.target.value);
    const newStart = e.target.value ? new Date(e.target.value) : undefined;
    onRangeChange(newStart, localEnd ? new Date(localEnd) : undefined);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEnd(e.target.value);
    const newEnd = e.target.value ? new Date(e.target.value) : undefined;
    onRangeChange(localStart ? new Date(localStart) : undefined, newEnd);
  };

  const handleReset = () => {
    setLocalStart("");
    setLocalEnd("");
    onRangeChange(undefined, undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 border border-stroke rounded-lg px-3 py-2 bg-surface">
        <CalendarIcon className="h-4 w-4 text-charcoal" />
        <input
          type="date"
          value={localStart}
          onChange={handleStartChange}
          max={format(new Date(), "yyyy-MM-dd")}
          className="text-sm bg-transparent border-none outline-none text-ink"
          placeholder="Start date"
        />
        <span className="text-charcoal">to</span>
        <input
          type="date"
          value={localEnd}
          onChange={handleEndChange}
          max={format(new Date(), "yyyy-MM-dd")}
          min={localStart}
          className="text-sm bg-transparent border-none outline-none text-ink"
          placeholder="End date"
        />
      </div>
      {(localStart || localEnd) && (
        <Button size="sm" variant="outline" onClick={handleReset}>
          Reset
        </Button>
      )}
    </div>
  );
}

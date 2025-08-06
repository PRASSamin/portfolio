"use client";
import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function DateRangeSelector({
  label,
  onChange,
  value,
}: {
  label?: string;
  onChange?: (range: DateRange) => void;
  value?: DateRange;
}) {
  return (
    <div className="flex flex-col gap-3">
      {label && (
        <Label htmlFor="dates" className="px-1">
          {label}
        </Label>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="dates"
            className="justify-between font-normal w-full py-5"
          >
            {value?.from && value?.to
              ? `${value.from.toLocaleDateString()} - ${value.to.toLocaleDateString()}`
              : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end">
          <Calendar
            mode="range"
            selected={value}
            captionLayout="dropdown"
            onSelect={(range) => {
              if (!range) return;
              onChange?.(range);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

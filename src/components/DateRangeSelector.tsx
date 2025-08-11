"use client";
import { SyntheticEvent, useState } from "react";
import { DateRangePicker } from "rsuite";
import { format } from "date-fns";
import { CustomProvider } from "rsuite";

import "rsuite/DateRangePicker/styles/index.css";
import { DateRange } from "rsuite/esm/DateRangePicker";

export default function DateRangeSelector({
  onChange,
  value,
}: {
  onChange?: (range: { startDate: Date; endDate?: Date }) => void;
  value?: { startDate: Date; endDate?: Date };
}) {
  // @ts-expect-error: unnecessary
  const [selectedRange, setSelectedRange] = useState<DateRange | null>([
    value?.startDate ?? null,
    value?.endDate ?? null,
  ]);

  const handleChange = (
    ranges: DateRange | null,
    event: SyntheticEvent<Element, Event>
  ) => {
    setSelectedRange(ranges);

    const startDate = ranges?.[0];
    const endDate = ranges?.[1];

    const shouldSetEndDate =
      endDate instanceof Date &&
      startDate instanceof Date &&
      endDate.getTime() !== startDate.getTime();

    onChange?.({
      startDate: startDate ?? new Date(),
      endDate: shouldSetEndDate ? endDate : undefined,
    });
  };

  return (
    <CustomProvider theme="dark">
      <DateRangePicker
        showHeader={false}
        menuStyle={{ zIndex: 50, pointerEvents: "all" }}
        appearance="subtle"
        onChange={handleChange}
        value={selectedRange}
        character=" - "
        className="
          [&>.rs-picker-input-group]:!bg-transparent 
          [&>.rs-picker-input-group]:!border-border 
          [&>.rs-picker-input-group]:!py-1 
          [&_.rs-input]:!bg-transparent
        "
        menuClassName="scrollbar-show-light [&_.rs-calendar-month-view_.rs-calendar-header-backward]:!flex [&_.rs-calendar-month-view_.rs-calendar-header-forward]:!flex"
        renderValue={(value, formatStr) => {
          if (!value?.[0]) return "";
          const start = format(value[0], formatStr);
          const end =
            value[1] && value[1].getTime() !== value[0].getTime()
              ? format(value[1], formatStr)
              : "Present";
          return `${start} - ${end}`;
        }}
      />
    </CustomProvider>
  );
}
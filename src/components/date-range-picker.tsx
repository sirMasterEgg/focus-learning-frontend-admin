import { format, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HTMLAttributes, useState } from "react";
import { useSearchParams } from "react-router-dom";

type DateRangePickerProps = {
  from?: Date;
  to?: Date;
} & HTMLAttributes<HTMLDivElement>;

export function DatePickerWithRange({
  className,
  from = subDays(new Date(), 7),
  to = new Date(),
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: from,
    to: to,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const handleDateChange = (open: boolean) => {
    if (!open && date?.from && date?.to) {
      const fromDate = format(date.from, "yyyy-MM-dd");
      const toDate = format(date.to, "yyyy-MM-dd");

      const temp: { [key: string]: string } = {};
      searchParams.forEach((value, key) => {
        temp[key] = value;
      });

      temp["from"] = fromDate;
      temp["to"] = toDate;

      setSearchParams(temp);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={cn("grid gap-2", className)}>
        <Popover onOpenChange={(open) => handleDateChange(open)}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[260px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/*<Button
        onClick={() => {
          setDate({
            from: new Date(),
            to: addDays(new Date(), 7),
          });
          searchParams.delete("from");
          searchParams.delete("to");
          setSearchParams(searchParams);
        }}
        className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90"
      >
        <X />
      </Button>*/}
    </div>
  );
}

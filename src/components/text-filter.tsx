import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { Input } from "@/components/ui/input.tsx";

export default function TextFilter({ placeholder }: { placeholder: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [textFilter, setTextFilter] = useState<string>("");
  const debounced = useDebounce(textFilter, 500);

  useEffect(() => {
    const temp: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      temp[key] = value;
    });

    if (debounced === "") {
      delete temp["q"];
      setSearchParams(temp);
      return;
    }

    temp["q"] = debounced;

    setSearchParams(temp);
  }, [debounced]);

  return (
    <Input
      type="text"
      onChange={(e) => setTextFilter(e.target.value)}
      placeholder={placeholder}
    />
  );
}

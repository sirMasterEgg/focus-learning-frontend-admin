import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useSearchParams } from "react-router-dom";

export default function PageSize() {
  const [searchParams, setSearchParams] = useSearchParams();

  const handlePageSize = (page: string) => {
    const temp: { [key: string]: string } = {};
    searchParams.forEach((value, key) => {
      temp[key] = value;
    });

    temp["size"] = page;

    setSearchParams(temp);
  };

  return (
    <>
      <div className="inline-flex flex-row items-center gap-2.5">
        <span className="text-muted-foreground text-xs">Shows</span>
        <Select
          onValueChange={(page) => handlePageSize(page)}
          defaultValue={searchParams.get("size") || "10"}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

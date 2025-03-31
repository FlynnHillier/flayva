import { queries } from "@/queries";
import { useQuery } from "@tanstack/react-query";

export const fetchTags = () => {
   return(useQuery(queries.tags))
}
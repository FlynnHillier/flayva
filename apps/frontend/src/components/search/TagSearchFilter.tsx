import { useIsMobile } from "../../hooks/use-mobile";
import { TagSelectorMobile } from "../tags/TagSelectorMobile";
import { TagSelectorRegular } from "../tags/TagSelectorRegular";

export const TagSearchFilter = () => {
  const isMobile = useIsMobile();

  return isMobile ? <TagSelectorMobile /> : <TagSelectorRegular />;
};

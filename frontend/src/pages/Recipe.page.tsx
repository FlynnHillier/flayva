import Recipe from "@/components/recipe/Recipe";
import { useParams } from "react-router-dom";

export default function RecipePage() {
  const { objectid } = useParams();
  //fetch with id

  return (
    <>
      <Recipe />
    </>
  );
}

export default function RecipeSection({ heading }: { heading: string}, { body }: { body: string }) {
  return(
    <>
    <div className="recipeSection">
       <h2>{heading}:</h2>
      <p>{body}</p>
    </div>
     
    </>
  )
}
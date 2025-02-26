export default function RecipeSection({ heading }: { heading: string}, { body }: { body: string }) {
  return(
    <>
      <h2>{heading}:</h2>
      <p>{body}</p>
    </>
  )
}
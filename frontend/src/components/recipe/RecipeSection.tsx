export default function RecipeSection(props:
  {
    heading: string;
    body: string;
  }) {
	return (
		<>
			<div className="recipeSection">
				<h2 className="">{props.heading}:</h2>
				<p>{props.body}</p>
			</div>
		</>
	);
}

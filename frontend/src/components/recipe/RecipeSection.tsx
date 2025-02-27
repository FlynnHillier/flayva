export default function RecipeSection(props: {
	heading: string;
	body: string;
}) {
	return (
		<>
			<div className="w-full p-2 flex flex-col">
				<h2 className="">{props.heading}:</h2>
				<p>{props.body}</p>
			</div>
		</>
	);
}

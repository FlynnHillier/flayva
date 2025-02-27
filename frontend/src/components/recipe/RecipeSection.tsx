export default function RecipeSection(props: {
	heading: string;
	body: string;
}) {
	return (
		<>
			<div className="w-full p-6 flex flex-col">
				<h2 className="text-large text-2xl font-bold">{props.heading}:</h2>
				<p className="text-gray-500">{props.body}</p>
			</div>
		</>
	);
}

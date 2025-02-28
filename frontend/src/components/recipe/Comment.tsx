type Comment = {
	profilePic: string;
	username: string;
	body: string;
};

export default function Comment(props: Comment) {
	return (
		<>
			<li className="flex flex-row">
				<div className="w-2/12">
					<img className="rounded-full" src={props.profilePic} alt="" />
					<div className="flex">
						<h3 className="text-large font-bold mb-2">{props.username}</h3>
						<p className="text-gray-500">{props.body}</p>
					</div>
				</div>
			</li>
		</>
	);
}

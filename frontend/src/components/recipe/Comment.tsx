type Comment = {
	profilePic: string;
	username: string;
	body: string;
};

export default function Comment(props: Comment) {
	return (
		<>
			<li className="w-full mt-2" >
				<div className="w-full flex flex-row gap-3" id="main">
					<div id="profilePic" className="w-2/12">
						<img className="rounded-full" src={props.profilePic} alt="" />
					</div>
					<div className="flex flex-col w-10/12 gap-0" id="content">
						<h3 className="text-large font-bold mb-2">{props.username}</h3>
						<p className="text-gray-500 -mt-2">{props.body}</p>
					</div>
				</div>
			</li>
		</>
	);
}

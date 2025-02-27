type Comment = {
  profilePic: string;
  username: string;
  body: string;
}

type CommentsProp = {
  comments: Comment[];
}

export default function Comments(prop: CommentsProp) {
	const commentsList = prop.comments.map((comment) => {
		return (
			<>
				<li className="flex flex-row">
					<div className="w-2/12"><img className="rounded-full" src={comment.profilePic} alt="" /></div>

				</li>
			</>
		);
	});
	return <ul>{commentsList}</ul>;
}
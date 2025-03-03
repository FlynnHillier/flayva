import Comment from './Comment';

type CommentsProp = {
	comments: Comment[];
};

type Comment = {
	profilePic: string;
	username: string;
	body: string;
};

export default function Comments(prop: CommentsProp) {
	const commentsList = prop.comments.map((comment) => {
		return (
			<Comment
				profilePic={comment.profilePic}
				username={comment.username}
				body={comment.body}
			/>
		);
	});

	return <ul>{commentsList}</ul>;
}

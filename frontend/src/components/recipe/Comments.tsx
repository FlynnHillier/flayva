type CommentType = {
  profilePic: string;
  username: string;
  text: string;
};

function Comment({ profilePic, username, text }: CommentType) {
  return (
    <li className="w-full mt-2">
      <div className="w-full flex flex-row gap-3" id="main">
        <div id="profilePic" className="w-9 grid">
          <img
            className="w-full rounded-full aspect-square place-self-center"
            src={profilePic}
            alt=""
          />
        </div>
        <div className="flex flex-col w-10/12 gap-0" id="content">
          <h3 className="text-large font-bold mb-2">{username}</h3>
          <p className="text-gray-500 -mt-2">{text}</p>
        </div>
      </div>
    </li>
  );
}

export default function Comments({ comments }: { comments: CommentType[] }) {
  return (
    <ul>
      {comments.map((comment) => (
        <Comment {...comment} />
      ))}
    </ul>
  );
}

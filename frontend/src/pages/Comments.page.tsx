import Comments from "@/components/recipe/Comments";

export default function CommentsPage() {
  const COMMENTS = [
    {
      profilePic:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
      username: "John Doe",
      text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
    },
    {
      profilePic:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
      username: "John Doe",
      text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
    },
    {
      profilePic:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
      username: "John Doe",
      text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
    },
    {
      profilePic:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
      username: "John Doe",
      text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
    },
    {
      profilePic:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s",
      username: "John Doe",
      text: "This recipe is delicious! fh fh dif d ididdihjfh dididiihf",
    },
  ];
  return ( 
  <div className="w-full p-10">
    <div className="border-2 rounded-3xl p-3">
      <Comments comments={COMMENTS}></Comments>
    </div>
  </div>)
}

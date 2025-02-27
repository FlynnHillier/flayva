import RecipeSection from './RecipeSection';
import RecipeIngredients from './RecipeIngredients';
import Comments from './Comments';

const ingredients = [
	{
		ingredient: 'Flour',
		amount: 2,
		unit: 'cups',
	},
	{
		ingredient: 'Chicken',
		amount: 2,
		unit: 'Kg',
	},
	{
		ingredient: 'Goon',
		amount: 2,
		unit: 'goon',
	},
];

const cookingTime = [
	{
		ingredient: 'Prep Time',
		amount: 2,
		unit: 'min',
	},
	{
		ingredient: 'Cook time',
		amount: 2,
		unit: 'hr',
	},
];

const comments = [
  {
    profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s',
    username: 'John Doe',
    body: 'This recipe is delicious!',
  }
]

export default function RecipeSidebar() {
	return (
		<>
			<div id="recipeSidebar" className="w-4/12 border-l-2 border-[#737373]">
				<RecipeSection
					heading={'Description'}
					body={
						'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam.'
					}
				/>
				<div className="w-full p-6 flex flex-col">
					<h2 className="text-large text-2xl font-bold mb-2">Ingredients:</h2>
					<RecipeIngredients ingredients={ingredients} />
				</div>

				<RecipeSection
					heading={'Recipe'}
					body={
						'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam.'
					}
				/>
				<div className="w-full p-6 flex flex-col">
					<h2 className="text-large text-2xl font-bold mb-2">Time:</h2>
					<RecipeIngredients ingredients={cookingTime} />
				</div>
				<Comments comments={comments}/>
			</div>
		</>
	);
}

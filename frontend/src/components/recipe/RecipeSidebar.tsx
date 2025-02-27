import RecipeSection from './RecipeSection';

export default function RecipeSidebar() {
	return (
		<>
			<div id="recipeSidebar" className="w-4/12 border-l-2 border-[#737373]">
				<RecipeSection heading={'Description'} body={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam.'} />
        <RecipeSection heading={'Ingredients'} body={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam.'} />
        <RecipeSection heading={'Recipe'} body={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam.'} />
        <RecipeSection heading={'Time'} body={'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Natus aliquid voluptas libero numquam optio placeat aut, voluptate molestias hic nemo animi odit facilis esse distinctio, deleniti assumenda omnis explicabo aliquam.'} />
			</div>
      
		</>
	);
}

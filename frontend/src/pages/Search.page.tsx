import { useState } from 'react';
import Tags from '@/components/search/common/Tags';
import RecipeSearchResults from '@/components/search/RecipeSearch';
import UserSearchResults from '@/components/search/UserSearch';
import { Search, CookingPot, Users } from 'lucide-react';
import { Switch } from '@radix-ui/react-switch';

// Main page for searching
export default function SearchComponent() {
	const [input, setInput] = useState('');
	const [current, setCurrent] = useState(true); // Toggle between user and recipe search

	// Simple function to switch between current search type
	function switchCurrent() {
		setCurrent(!current);
		setInput(''); // Clear input when switching
	}

	// Component for a search bar
	function SearchBar() {
		return (
			<div className="w-9/12 border-2 p-2 rounded-lg flex items-center">
				<Search color="#d5d5d5" />
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					autoFocus
					placeholder={`Search for ${current ? 'recipes' : 'users'}...`}
					className="w-full p-2 rounded-md outline-none"
				/>
			</div>
		);
	}

	// Component for a switch bar, to switch between user/recipe search
	function SwitchBar() {
		return (
			<div className="flex items-center gap-3 p-2 justify-center">
				<CookingPot size={20} color={current ? '#000' : '#d5d5d5'} />
				<Switch
					checked={current}
					onCheckedChange={switchCurrent}
					className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer"
				>
					<span
						className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
							current ? '' : 'translate-x-4'
						}`}
					/>
				</Switch>

				<Users size={20} color={!current ? '#000' : '#d5d5d5'} />
			</div>
		);
	}

	// Main component
	return (
		<>
			<div className="w-screen h-screen flex justify-center items-center gap-5">
				<div className="w-6/12 lg:w-6/12 h-9/12 border-2 border-[#e5e5e5] rounded-md p-4 overflow-hidden flex flex-col">
					<div className="w-full flex items-center justify-center gap-5 flex-col md:flex-row ">
						<SwitchBar />
						<SearchBar />
					</div>
					
					{/* Dynamically chooses whether to display user/recipe search based on user input */}
					<div className="flex-grow overflow-auto mt-5">
						{/* Currently using "a" as a standard input */}
						{/* TODO: make suggestion for a user */}
						{current ? (
							<RecipeSearchResults input={input || 'a'} /> // Pass input to RecipeSearch
						) : (
							<UserSearchResults input={input || 'a'} /> // Pass input to UserSearch
						)}
					</div>
				</div>
				<Tags />
			</div>
		</>
	);
}

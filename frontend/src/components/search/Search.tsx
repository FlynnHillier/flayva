import { useState } from 'react';
import Tags from './common/Tags';
import RecipeSearch from './RecipeSearch';
import UserSearch from './UserSearch';
import { Search } from 'lucide-react';

export default function SearchComponent() {
	const [input, setInput] = useState('');
	const [current, setCurrent] = useState(true); // Toggle between user and recipe search

	function switchCurrent() {
		setCurrent(!current);
		setInput(''); // Clear input when switching
	}

	function SearchBar() {
		return (
			<div className="w-full flex items-center justify-center">
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
			</div>
		);
	}

	function SwitchBar() {
		return (
			<div className="w-full flex justify-center">
				<div className="w-9/12">
					<div className="flex justify-center items-center gap-4 w-full">
						<button
							onClick={switchCurrent}
							className="w-50 h-12 text-white rounded-md cursor-pointer"
						>
							<span className='text-gray-600'>	Switch to {current ? 'Users' : 'Recipes'}...</span>
						
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<div className="w-screen h-screen flex justify-center items-center gap-20">
				<div className="w-4/12 h-9/12 border border-black rounded-md p-4 overflow-hidden flex flex-col">
					<div id="search">
						
					</div>
					<SearchBar />
					<SwitchBar />
					<div className="flex-grow overflow-auto">
						{current ? (
							<RecipeSearch input={input || 'a'} /> // Pass input to RecipeSearch
						) : (
							<UserSearch input={input || 'a'} /> // Pass input to UserSearch
						)}
					</div>
				</div>
				<Tags />
			</div>
		</>
	);
}

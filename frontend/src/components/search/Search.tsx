import { useState } from 'react';
import Tags from './common/Tags';
import RecipeSearch from './RecipeSearch';
import UserSearch from './UserSearch';

export default function Search() {
	const [input, setInput] = useState('');
	const [current, setCurrent] = useState(true); // Toggle between user and recipe search

	function switchCurrent() {
		setCurrent(!current);
		setInput(''); // Clear input when switching
	}

	function SearchBar() {
		return (
			<input
				type="text"
				value={input}
				onChange={(e) => setInput(e.target.value)}
				autoFocus
				placeholder={`Search for ${current ? 'recipes' : 'users'}...`}
				className="w-full p-2 border rounded-md"
			/>
		);
	}

	function SwitchBar() {
		return (
			<div className="flex justify-center items-center gap-4 w-full">
				<button
					onClick={switchCurrent}
					className="w-36 h-8 bg-blue-500 text-white rounded-md"
				>
					Switch to {current ? 'Users' : 'Recipes'}
				</button>
			</div>
		);
	}

	return (
		<>
			<div className="w-screen h-screen flex justify-center items-center gap-20">
				<div className="w-4/12 h-9/12 border border-black rounded-md p-4 overflow-hidden flex flex-col">
					<SearchBar />
					<SwitchBar />
					<div className="flex-grow overflow-auto">
						{current ? (
							<RecipeSearch input={input} /> // Pass input to RecipeSearch
						) : (
							<UserSearch input={input} /> // Pass input to UserSearch
						)}
					</div>
				</div>
				<Tags />
			</div>
		</>
	);
}

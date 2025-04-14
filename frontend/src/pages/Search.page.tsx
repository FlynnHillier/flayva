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
  const [showFilters, setShowFilters] = useState(true); // Default to showing filters

  // Simple function to switch between current search type
  function switchCurrent() {
    setCurrent(!current);
    setInput(''); // Clear input when switching
  }

  // Toggle filters visibility
  function toggleFilters() {
    setShowFilters(!showFilters);
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
        {current && (
          <button 
            onClick={toggleFilters}
            className="ml-2 p-1 rounded-md hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d5d5d5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        )}
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
      <div className="w-screen h-screen flex justify-center items-start gap-5 pt-16">
        <div className="w-6/12 lg:w-6/12 h-9/12 border-2 border-[#e5e5e5] rounded-md p-4 overflow-hidden flex flex-col">
          <div className="w-full flex items-center justify-center gap-5 flex-col md:flex-row ">
            <SwitchBar />
            <SearchBar />
          </div>

          {/* Dynamically chooses whether to display user/recipe search based on user input */}
          <div className="flex-grow overflow-auto mt-5">
            {current ? (
              <RecipeSearchResults input={input || 'a'} /> // Pass input to RecipeSearch
            ) : (
              <UserSearchResults input={input || 'a'} /> // Pass input to UserSearch
            )}
          </div>
        </div>
        
        {/* Show filters when in recipe search mode and filters are toggled on */}
        {current && showFilters && <Tags />}
      </div>
    </>
  );
}

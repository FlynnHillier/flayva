import { useState, useEffect } from "react";
import Tags from "@/components/search/common/Tags";
import RecipeSearchResults from "@/components/search/RecipeSearch";
import UserSearchResults from "@/components/search/UserSearch";
import MobileFilters from "@/components/tags/MobileFilters";
import { Search, CookingPot, Users } from "lucide-react";
import { Switch } from "@radix-ui/react-switch";

// Main search component
export default function SearchComponent() {
  // State for search input text
  const [input, setInput] = useState("");

  // Toggle between recipe search (true) and user search (false)
  const [current, setCurrent] = useState(true);

  // Controls visibility of the desktop filter sidebar
  const [visible, setVisible] = useState(true);

  // Controls visibility of the mobile filter overlay
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Tracks if the current viewport is mobile-sized
  const [isMobile, setIsMobile] = useState(false);

  // Shared state for selected filter tags across components
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  /**
   * Effect to detect and respond to screen size changes
   * Sets isMobile flag based on window width
   */
  useEffect(() => {
    // Function to check if viewport is mobile-sized
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };

    // Initial check
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  /**
   * Switches between recipe and user search modes
   * Resets the search input when switching
   */
  function switchCurrent() {
    setCurrent(!current);
    setInput(""); // Clear input when switching
  }

  /**
   * Toggles filter visibility based on device type
   * Opens mobile filter overlay on small screens
   * Toggles sidebar visibility on larger screens
   */
  function toggleFilters() {
    if (isMobile) {
      setIsMobileFilterOpen(!isMobileFilterOpen);
    } else {
      setVisible(!visible);
    }
  }

  /**
   * SearchBar component - Renders the search input field with filter toggle
   * @returns JSX for the search input bar
   */
  function SearchBar() {
    return (
      <div className="w-9/12 border-2 p-2 rounded-lg flex items-center">
        <Search color="#d5d5d5" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoFocus
          placeholder={`Search for ${current ? "recipes" : "users"}...`}
          className="w-full p-2 rounded-md outline-none"
        />
        {/* Only show filter button when in recipe search mode */}
        {current && (
          <button
            onClick={toggleFilters}
            className="ml-2 p-1 rounded-md hover:bg-gray-100"
            aria-label="Toggle filters"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d5d5d5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        )}
      </div>
    );
  }

  /**
   * SwitchBar component - Renders the toggle between recipe and user search
   * @returns JSX for the search mode toggle switch
   */
  function SwitchBar() {
    return (
      <div className="flex items-center gap-3 p-2 justify-center">
        {/* Recipe icon - highlighted when in recipe search mode */}
        <CookingPot size={20} color={current ? "#000" : "#d5d5d5"} />

        {/* Toggle switch */}
        <Switch
          checked={current}
          onCheckedChange={switchCurrent}
          className="w-10 h-6 bg-gray-200 rounded-full relative cursor-pointer"
        >
          <span
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
              current ? "" : "translate-x-4"
            }`}
          />
        </Switch>

        {/* User icon - highlighted when in user search mode */}
        <Users size={20} color={!current ? "#000" : "#d5d5d5"} />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen flex justify-center items-start gap-5 pt-16">
      {/* Main search container */}
      <div className="w-9/12 md:w-6/12 lg:w-6/12 h-9/12 border-2 border-[#e5e5e5] rounded-md p-4 overflow-hidden flex flex-col">
        {" "}
        {/* Search controls section */}
        <div className="w-full flex items-center justify-center gap-5 flex-col md:flex-row">
          <SwitchBar />
          <SearchBar />
        </div>
        {/* Search results section */}
        <div className="flex-grow overflow-auto mt-5">
          {current ? (
            // Recipe search results
            <RecipeSearchResults
              input={input}
              selectedTagIds={selectedTagIds}
            />
          ) : (
            // User search results
            <UserSearchResults input={input} />
          )}
        </div>
      </div>

      {/* Desktop filter sidebar - only shown on larger screens and in recipe search mode */}
      {current && !isMobile && (
        <Tags
          visible={visible}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
        />
      )}

      {/* Mobile filter overlay - conditionally rendered based on state */}
      {current && (
        <MobileFilters
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          selectedTagIds={selectedTagIds}
          setSelectedTagIds={setSelectedTagIds}
        />
      )}
    </div>
  );
}

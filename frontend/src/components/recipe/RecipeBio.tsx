type Bio = {
	profilePic: string;
	username: string;
	rating: number;
};

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface StarRatingProps {
	rating: number; // A double value from 0.0 to 5.0
	className?: string; // Optional custom Tailwind classes
}

export const StarRating: React.FC<StarRatingProps> = ({
	rating,
	className = 'text-yellow-500 w-16 h-16',
}) => {
	// Calculate the number of full stars
	const fullStars = Math.floor(rating);
	// Determine if a half star is needed (for ratings with a fractional part >= 0.5)
	const hasHalfStar = rating - fullStars >= 0.5;
	// Calculate the remaining empty stars so that a total of 5 stars is displayed
	const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

	return (
		<div className={`flex items-center ${className}`}>
			{Array.from({ length: fullStars }).map((_, index) => (
				<FaStar key={`full-${index}`} />
			))}
			{hasHalfStar && <FaStarHalfAlt key="half" />}
			{Array.from({ length: emptyStars }).map((_, index) => (
				<FaRegStar key={`empty-${index}`} />
			))}
		</div>
	);
};

export default function RecipeBio(props: Bio) {
	return (
		<div className="flex items-center justify-between p-6">
			<div className="flex items-center">
				<img
					className="w-12 h-12 rounded-full object-cover"
					src={props.profilePic}
					alt={props.username}
				/>
				<div className="ml-4 text-md font-bold">{props.username}</div>
			</div>
			<div className="text-gray-500">
				<StarRating rating={props.rating} className='text-yellow-500'/>
				<div className="text-sm font-medium absolute ml-8">
					{props.rating.toFixed(1)}
				</div>
			</div>
		</div>
	);
}

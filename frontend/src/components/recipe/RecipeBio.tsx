import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';


export const StarRating: React.FC = ({
	rating,
	className = 'text-yellow-500 w-16 h-16',
}) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating - fullStars >= 0.5;
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

export default function RecipeBio({
	profilePic,
	username,
	rating,
}: {
	profilePic: string;
	username: string;
	rating: number;
}) {
	return (
		<div className="flex items-center justify-between p-6">
			<div className="flex items-center">
				<img
					className="w-12 h-12 rounded-full object-cover"
					src={profilePic}
					alt={username}
				/>
				<div className="ml-4 text-md font-bold">{username}</div>
			</div>
			<div className="text-gray-500">
				<StarRating rating={rating} className="text-yellow-500" />
				<div className="text-sm font-medium relative ml-8">
					{rating.toFixed(1)}
				</div>
			</div>
		</div>
	);
}

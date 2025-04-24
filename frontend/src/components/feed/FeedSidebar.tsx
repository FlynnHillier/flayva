import { cn } from '@/lib/utils';
import { Post } from '@flayva-monorepo/shared/types';
import { useMemo } from 'react';
import { ClassNameValue } from 'tailwind-merge';
import { Ingredient } from '../post/view/post-recipe-details';
import { PostRating } from '../post/ratings/ratings-common';
import Tags from '../tags/Tags';
import { Link } from 'react-router-dom';
import { UserCard } from '@/components/common/profile.common';

const SidebarSection = ({
	header,
	children,
}: React.PropsWithChildren<{ header: string }>) => {
	return (
		<div className="flex flex-col gap-2 w-full h-fit rounded-lg">
			<h2 className="text-xl font-semibold">{header}</h2>
			{children}
		</div>
	);
};

export const FeedSidebar = ({
	post,
	className,
	isTransitioning = false,
}: {
	className?: ClassNameValue;
	post: Post | undefined;
	isTransitioning: boolean;
}) => {
	const isSkeleton = useMemo(
		() => isTransitioning || !post,
		[isTransitioning, post]
	);

	return (
		<div
			className={cn(
				'border-x-2 py-7 px-4 flex flex-col space-y-2 h-full overflow-y-auto',
				className
			)}
		>
			<UserCard user={post?.owner} />
			<span className="Recipe text-2xl font-semibold">
				{post?.recipe.title}
			</span>
			<PostRating
				rating={post?.recipe.ratings.statiststics.average}
				className={'mt-2'}
			/>
			<span className="text-sm text-muted-foreground">
				{isSkeleton ? (
					<span className="h-4 w-32 animate-pulse bg-muted rounded-full" />
				) : (
					new Date(post?.created_at ?? '').toLocaleDateString('en-GB', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					})
				)}
			</span>
			<div className="flex flex-col space-y-8 mt-2">
				<Tags tags={post?.recipe.tags} />
				<SidebarSection header="Ingredients">
					<ul className="flex flex-col space-y-1 list-disc list-inside">
						{isSkeleton
							? Array.from({ length: 4 }).map((_) => (
									<li className="h-6 w-42 animate-pulse bg-muted rounded-full" />
							  ))
							: post?.recipe.ingredients.map((ingredient) => (
									<li
										key={ingredient.ingredientItem.id}
										className="text-sm font-semibold text-primary-foreground-foreground"
									>
										<Ingredient ingredient={ingredient} />
									</li>
							  ))}
					</ul>
				</SidebarSection>
				<SidebarSection header="Instructions">
					<ol className="list-decimal list-inside space-y-1 pl-1">
						{isSkeleton
							? Array.from({ length: 4 }).map((_) => (
									<li className="h-6 w-42 animate-pulse bg-muted rounded-full" />
							  ))
							: post?.recipe.instructions.map((instruction, index) => (
									<li key={index} className="flex items-start gap-2 ">
										<span className="font-medium">{index + 1}.</span>
										<p className="flex-1">{instruction.instruction}</p>
									</li>
							  ))}
					</ol>
				</SidebarSection>
			</div>
			<div className="flex justify-center mt-4">
				<Link
					to={{ pathname: `/p/${post?.id}` }}
					className="
            inline-block
            px-6 py-2
            rounded-md
            bg-primary
            text-white
            font-semibold
            transition
            duration-150
            hover:bg-primary-dark
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            focus:ring-offset-2
            shadow
          "
				>
					View more info...
				</Link>
			</div>
		</div>
	);
};

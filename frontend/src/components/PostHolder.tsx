import React from 'react';
import { useState } from 'react';
import { Skeleton } from './ui/skeleton';

function PostHolder() {
const [loading, setLoading] = useState(true);
  return (
    <div className='w-full h-full rounded-2xl flex justify-center items-center pl-20'>
        {loading ? (<Skeleton className='w-[785px] h-[785px]' />) : (<img src="https://via.placeholder.com/150" alt="post" />)}
    </div>
  )
}

export default PostHolder

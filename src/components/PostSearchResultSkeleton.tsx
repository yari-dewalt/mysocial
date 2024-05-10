// @ts-nocheck
function PostSearchResultSkeleton() {
  return (
    <div className="flex flex-col gap-1 p-2 hover:bg-gray-200">
      <div className="flex gap-2 items-center">
        <div className="rounded-full min-w-11 max-w-11 min-h-11 max-h-11 bg-neutral-300"></div>
          <div className="flex flex-col gap-2">
            <div className="rounded-lg min-w-24 max-w-24 min-h-4 max-h-4 bg-neutral-300"></div>
            <div className="rounded-lg min-w-20 max-w-20 min-h-4 max-h-4 bg-neutral-300"></div>
          </div>
      </div>
      <div className="flex flex-col gap-4 w-full p-6">
        <div className="min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
        <div className="min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
        <div className="min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
      </div>
    </div>
  )
}

export default PostSearchResultSkeleton;

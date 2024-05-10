// @ts-nocheck
function UserSearchResultSkeleton() {
  return (
    <div className="p-2 pr-6 hover:bg-gray-200 flex justify-between items-center min-h-20 max-h-20">
      <div className="flex gap-2 items-center">
        <div className="rounded-full min-w-14 max-w-14 min-h-14 max-h-14 bg-neutral-300"></div>
        <div className="flex flex-col gap-1">
          <div className="min-w-24 max-w-24 min-h-4 max-h-4 bg-neutral-300 rounded-lg"></div>
          <div className="min-w-20 max-w-20 min-h-4 max-h-4 bg-neutral-300 rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}

export default UserSearchResultSkeleton;

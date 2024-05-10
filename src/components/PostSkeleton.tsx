function PostSkeleton() {
  return (
    <div className="flex flex-col bg-white w-full max-w-[50rem] phone:w-full phone:max-w-72 h-[13.5rem] items-center shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)]">
      <div className="bg-white w-full phone:w-full flex flex-col items-center">
        <div className="w-full flex flex-col gap-2 p-6 pt-3 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <div className="rounded-full min-w-14 max-w-14 min-h-14 max-h-14 bg-neutral-300"></div>
              <div className="flex flex-col gap-2">
                <div className="min-w-28 max-w-28 min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
                <div className="min-w-20 max-w-20 min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full p-6">
          <div className="min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
          <div className="min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
          <div className="min-h-4 max-h-4 rounded-lg bg-neutral-300"></div>
        </div>
      </div>
    </div>
  )
}

export default PostSkeleton;

import UserCircle from "./UserCircle";
import ImageViewer from "./ImageViewer"; // Assuming this is a component you have
import { Link } from "react-router-dom";
import TimeAgo from "javascript-time-ago";

function PostSearchResult({ post }) {
  const timeAgo = new TimeAgo("en-US");

  return (
    <>
      {(!post.images || post.images.length === 0) && post.user && (
        <Link to={`/posts/${post._id}`} className="flex flex-col gap-1 justify-center p-2 hover:bg-gray-200 w-full">
          <div className="flex gap-2 items-center">
            <UserCircle user={post.user} size={4} />
            <Link to={`/users/${post.user._id}`} className="flex flex-col">
              <h3 className="text-black font-medium -mb-1 hover:text-neutral-700">{post.user.name}</h3>
              <p className="text-neutral-500 hover:text-neutral-600">{post.user.username}</p>
            </Link>
          </div>
          <div className="pl-2">
            <p>{post.text}</p>
          </div>
          <div className="flex items-center gap-2 pl-2">
            <div className="flex items-center gap-1">
              <p className="font-medium">{post.likes.length}</p>
              <p className="text-neutral-700">likes</p>
            </div>
            <div className="flex items-center gap-1">
              <p className="font-medium">{post.comments.length}</p>
              <p className="text-neutral-700">comments</p>
            </div>
            <p className="text-neutral-600 text-sm">{timeAgo.format(new Date(post.timestamp))}</p>
          </div>
        </Link>
      )}
      {post.images && post.images.length > 0 && post.user && (
        <div className="flex flex-col max-w-[40rem] min-w-[17rem] bg-white w-full phone:w-full hover:bg-gray-200">
          <Link to={`/posts/${post._id}`} className="max-w-[40rem] bg-white relative w-full phone:w-full hover:bg-gray-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between p-2">
                <div className="flex gap-2 items-center">
                  <UserCircle user={post.user} size={4}/>
                  <div className="flex gap-1 items-center">
                    <Link to={`/users/${post.user._id}`} className="hover:text-neutral-700 font-bold">{post.user.name}</Link>
                    <Link to={`/users/${post.user._id}`} className="text-neutral-500 hover:text-neutral-600 text-sm">{post.user.username}</Link>
                  </div>
                </div>
              </div>
              <div onClick={(e) => e.preventDefault()}>
                <ImageViewer images={post.images}/>
              </div>
              <div className="flex flex-col pl-3 pr-3 pb-4 gap-1">
                <p className="break-words">{post.text}</p>
                <div className="flex gap-1 items-center -mt-1">
                  <p className="text-neutral-500">{timeAgo.format(new Date(post.timestamp))}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <div className="flex gap-1">
                    <p className="font-semibold">{post.likes.length}</p>
                    <p className="text-neutral-700">likes</p>
                  </div>
                  <div className="flex gap-1">
                    <p className="font-semibold">{post.comments.length}</p>
                    <p className="text-neutral-700">comments</p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
}

export default PostSearchResult;

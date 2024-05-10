import { Link } from "react-router-dom";

function MessagingHeader({ user }) {
  return (
    <div className="p-2 flex justify-center items-center bg-white shadow-sm border-b-2 border-neutral-200">
      <div className="flex flex-col items-center">
        <Link to={`/users/${user._id}`} className="text-xl font-medium hover:text-neutral-800">{user.name}</Link>
        <Link to={`/users/${user._id}`} className="text-neutral-500 hover:text-neutral-600">{user.username}</Link>
      </div>
    </div>
  )
}

export default MessagingHeader;

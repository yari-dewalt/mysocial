import { Link } from "react-router-dom";

function UserCircle({ user, size }) {
  return (
    <Link to={`/users/${user._id}`}>
      <div style={{ "height": size * 11, "width": size * 11 }} className={`flex justify-center items-center rounded-full bg-gradient-to-bl from-violet-500 to-yellow-400 from-20%`}>
        <div style={{ "height": size * 10, "width": size * 10 }} className="bg-white rounded-full flex justify-center items-center">
          <img src={user.image} style={{ "height": size * 9.5, "width": size * 9.5 }} className="object-cover rounded-full"></img>
        </div>
      </div>
    </Link>
  )
}

export default UserCircle;

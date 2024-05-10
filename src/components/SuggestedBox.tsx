import type { User } from "../types.ts";

import UserSearchResult from "./UserSearchResult";
import NewMessageSearchResult from "./NewMessageSearchResult";

interface Props {
  users: User[],
  type: string
}

function SuggestedBox({ users, type }: Props) {
  return (
    <>
      {users.length > 0 &&
        (<div className="p-2 flex flex-col bg-white rounded items-center shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)]">
          <h2 className="text-xl font-medium">Suggested</h2>
          <div className="flex flex-col w-full">
            {users.map((user) => {
              if (type == "follow") return <UserSearchResult resultUser={user} key={user._id}/>
              else if (type == "message") return <NewMessageSearchResult resultUser={user} key={user._id}/>
            })}
          </div>
        </div>)
      }
    </>
  )
}

export default SuggestedBox;

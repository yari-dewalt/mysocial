import editIcon from "../assets/edit.svg";
import deleteIcon from "../assets/delete.svg";

import { motion } from "framer-motion";

function OptionsModal({ handleEditState, handleDeleteState }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="z-10 w-32 flex flex-col bg-white rounded absolute top-8 right-0 shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)]"
    >
      <div onClick={handleEditState} className="hover:cursor-pointer group rounded hover:bg-neutral-200 p-2 flex items-center justify-between">
        <p className="text-neutral-600 group-hover:text-black">Edit</p>
        <img src={editIcon} alt="edit icon" className="opacity-65 group-hover:opacity-100"></img>
      </div>
      <div onClick={handleDeleteState} className="hover:cursor-pointer group text-neutral-600 hover:text-black rounded hover:bg-neutral-200 p-2 flex items-center justify-between">
        <p className="text-neutral-600 group-hover:text-black">Delete</p>
        <img src={deleteIcon} alt="delete icon" className="brightness-75 opacity-65 group-hover:opacity-100"></img>
      </div>
    </motion.div>
  )
}

export default OptionsModal;

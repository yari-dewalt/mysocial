// @ts-nocheck
interface Props {
  message: string,
  cancelFunction: () => void,
  deleteFunction: () => void
}

function DeleteModal({ message, cancelFunction, deleteFunction }: Props) {
  return (
    <div className="z-20 w-screen h-screen fixed top-0 left-0 flex items-center justify-center bg-black bg-opacity-20">
      <div className="w-96 phone:w-80 bg-white rounded flex flex-col items-center gap-4 p-4 shadow-[0px_0px_3px_2px_rgba(0,0,0,0.25)]">
        <h2 className="text-center text-xl font-medium break-words">{message}</h2>
        <div className="flex items-center gap-3">
          <button onClick={cancelFunction} className="text-lg font-medium p-1 rounded bg-neutral-400 hover:bg-neutral-500 text-white">Cancel</button>
          <button onClick={deleteFunction} className="text-lg font-medium p-1 rounded bg-red-400 hover:bg-red-500 text-white">Delete</button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal;

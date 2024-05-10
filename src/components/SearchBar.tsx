// @ts-nocheck
import searchIcon from "../assets/search.svg";

interface Props {
  placeholder: string,
  handleChange: () => void
}

function SearchBar({ placeholder, handleChange }: Props) {
  return (
    <div className="flex items-center gap-2 h-10 pl-4 pr-4">
      <img src={searchIcon} className="min-w-5 w-6 opacity-50"></img>
      <input onChange={handleChange} placeholder={placeholder} className="font-medium text-lg text-neutral-600 outline-none grow bg-transparent"></input>
    </div>
  )
}

export default SearchBar;

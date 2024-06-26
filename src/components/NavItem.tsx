// @ts-nocheck
import { Link } from "react-router-dom"

interface Props {
  selectedImage: string,
  deselectedImage: string,
  text: string,
  link: string,
  selected: boolean,
  imageSize: number,
  rounded: boolean
}

function NavItem({ selectedImage, deselectedImage, text, link, selected, imageSize, rounded }: Props) {
  return (
    <Link to={link} className="flex gap-6 w-fit items-center">
      <img src={selected ? selectedImage : deselectedImage} style={{ "minHeight": imageSize * 11, "minWidth": imageSize * 11, "height": imageSize * 11, "width": imageSize * 11 }} className={`${rounded ? "rounded-full" : ""} ${selected ? "opacity-100" : "opacity-75"}`}></img>
      <h1 className={`text-xl ${selected ? "font-semibold" : "opacity-75"} phone:hidden`}>{text}</h1>
    </Link>
  )
}

export default NavItem;

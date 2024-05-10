// @ts-nocheck
import closeIcon from "../assets/close.svg";

interface Props {
  image: string,
  closeImage: string
}

function SingleImageView({ image, closeImage }: Props) {
  return (
    <div className="hover:cursor-default fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <img src={image} className="max-h-full max-w-full" alt="Full resolution" />
      <img onClick={closeImage} src={closeIcon} className="opacity-65 hover:opacity-100 hover:cursor-pointer min-w-8 invert absolute top-4 right-4"></img>
    </div>
  )
}

export default SingleImageView;

import SingleImageView from "./SingleImageView";

import arrowIcon from "../assets/arrow.svg";

import { useState, useEffect } from "react";

function ImageViewer({ images }) {
  const [number, setNumber] = useState<number>(0);
  const [isViewing, setIsViewing] = useState<boolean>(false);

  useEffect(() => {
    setNumber(images.length - 1);
  }, [images.length]);

  useEffect(() => {
    setNumber(0);
  }, []);

  function nextImage(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    let nextNumber = number + 1;
    if (nextNumber == images.length) nextNumber = images.length - 1;
    setNumber(nextNumber);
  }

  function prevImage(e: React.MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    let nextNumber = number - 1;
    if (nextNumber < 0) nextNumber = 0;
    setNumber(nextNumber);
  }

  function viewImage(e: React.MouseEvent) {
    e.preventDefault();
    setIsViewing(true);
  }

  return (
    <>
      <div onClick={viewImage} className="hover:cursor-pointer w-full relative group h-full phone:min-h-[20rem] min-h-[40rem]" style={{backgroundImage: `url(${images[number]})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
        {images.length > 1 &&
          (<>
            <div className="text-xs p-0.5 pl-1.5 pr-1.5 absolute top-1 right-1 flex justify-center items-center bg-black bg-opacity-50 rounded-xl">
              <p className="text-white">{`${number + 1}/${images.length}`}</p>
            </div>
            <button onClick={prevImage} className="rounded-full flex justify-center items-center opacity-0 phone:opacity-100 group-hover:opacity-100 transition-opacity duration-100 bg-black bg-opacity-35 absolute top-1/2 -translate-y-1/2 left-1">
              <img src={arrowIcon} className="invert rotate-90"></img>
            </button>
            <button onClick={nextImage} className="rounded-full flex justify-center items-center opacity-0 phone:opacity-100 group-hover:opacity-100 transition-opacity duration-100 bg-black bg-opacity-35 absolute top-1/2 -translate-y-1/2 right-1">
              <img src={arrowIcon} className="invert -rotate-90"></img>
            </button>
          </>)
        }
      </div>
      {isViewing &&
        <SingleImageView image={images[number]} closeImage={() => setIsViewing(false)}/>
      }
    </>
  )
}

export default ImageViewer;

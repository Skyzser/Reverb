import Image from "next/image";

export default function Button({
  width,
  height,
  image,
  onClick,
  extraDiv = null,
}) {
  // Button component which takes in all those values so that it could be highly customisable. The extraDiv is so that there could be another div added to the button if needed
  return (
    <div
      className="buttonContainer"
      style={{ width: width, height: height }}
      onClick={onClick}
    >
      <Image src={image} alt="Icon for the button" />
      {extraDiv}
    </div>
  );
}

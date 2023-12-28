import Image from "next/image";

import Minus from "../speedModulator/svg/Minus.svg";
import Plus from "../speedModulator/svg/Plus.svg";

export default function SpeedModulator({ speedValue, onChange }) {
  const speedOptions = [0.25, 0.5, 0.75, 1, 1.5, 2, 4];

  // Just checking whether the speed is the first or last element in the array so that it doesn't go out of bounds
  const handleSpeedChange = (speed, process) => {
    if (process === "increase") {
      let newSpeed = speedOptions[speedOptions.indexOf(speed) + 1];
      if (newSpeed) onChange(newSpeed);
    } else {
      let newSpeed = speedOptions[speedOptions.indexOf(speed) - 1];
      if (newSpeed) onChange(newSpeed);
    }
  };
  return (
    <div
      className="flex justify-between w-44 mainWhiteBg mainBorderRadius"
      style={{ height: "50px" }}
    >
      <div className="speedModulatorButton">
        <Image
          src={Minus}
          alt="Icon for the minus button for speed"
          onClick={() => handleSpeedChange(speedValue, "decrease")}
        />
      </div>
      <div className="flex flex-1 justify-center items-center tertiaryBg secondaryTextColour primaryText overflow-auto">
        {speedValue}x
      </div>
      <div className="speedModulatorButton">
        <Image
          src={Plus}
          alt="Icon for the minus button for speed"
          onClick={() => handleSpeedChange(speedValue, "increase")}
        />
      </div>
    </div>
  );
}

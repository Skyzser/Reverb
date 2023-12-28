import { useEffect, useState } from "react";

import Image from "next/image";

import VolDown from "../general/svg/VolDown.svg";
import VolUp from "../general/svg/VolUp.svg";

import Button from "@/components/misc/button";
import Select from "../general/svg/Select.svg";
import Cut from "../general/svg/Cut.svg";
import Undo from "../general/svg/Undo.svg";
import Redo from "../general/svg/Redo.svg";
import Delete from "../general/svg/Delete.svg";

import Slider from "@/components/misc/slider";
import SpeedModulator from "@/components/misc/speedModulator/speedModulator";
import {
  ChangePlaybackRate,
  ChangeVolume,
  ToggleDelete,
} from "@/util/audio_utils";

import { toast } from "react-hot-toast";

export default function Feature_General(props) {
  const [sliderValue, setSliderValue] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [deleted, setDeleted] = useState(false);
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    ChangeVolume(props.manager, sliderValue, props.selectedSegment);
  }, [sliderValue]);
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    ChangePlaybackRate(props.manager, speed, props.selectedSegment);
  }, [speed]);
  // Whenever the segment is changed, we need to check the current segment's saved value to update the visual state
  // accordingly.
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    setSliderValue(props.manager.segments[props.selectedSegment].edits.volume);
    setSpeed(props.manager.segments[props.selectedSegment].edits.playbackRate);
    setDeleted(props.manager.segments[props.selectedSegment].edits.deleted);
  }, [props.selectedSegment]);
  const handleCut = (e) => {
    e.preventDefault();
    props.setMode("cut");
    toast("Cut");
  };
  const handleSelect = (e) => {
    e.preventDefault();
    props.setMode("select");
    toast("Select");
  };

  // Information for each button in the tool section of this feature
  const buttonInfo = [
    {
      name: "Select",
      image: Select,
      onClick: handleSelect,
    },
    {
      name: "Cut",
      image: Cut,
      onClick: handleCut,
    },
    {
      name: "Undo",
      image: Undo,
      onClick: () => {
        toast("Undo");
      },
    },
    {
      name: "Redo",
      image: Redo,
      onClick: () => {
        toast("Redo");
      },
    },
    {
      name: deleted ? "Restore" : "Delete",
      image: deleted ? Undo : Delete,
      onClick: () => {
        // Flips between names to show the user that if they delete, they can restore and vice versa
        toast(deleted ? "Restore" : "Delete");
        setDeleted(!deleted);
        ToggleDelete(props.manager, props.selectedSegment);
      },
    },
  ];

  return (
    <div className="featureContainer">
      <div className="flex flex-col h-full w-full p-5 gap-5">
        <div className="flex h-12 primaryText">General</div>
        <div className="flex flex-col h-full overflow-auto">
          <div className="flex flex-col h-1/2">
            <div className="secondaryText">Volume</div>
            <div className="flex h-20">
              <div className="flex justify-center h-full w-14">
                <Image
                  src={VolDown}
                  alt="Icon for showing the volume down side of the volume slider"
                />
              </div>
              <div className="relative flex justify-center items-center h-full w-full pe-5">
                <Slider
                  min={-50}
                  max={50}
                  sliderValue={sliderValue}
                  onChange={setSliderValue}
                  disabled={props.manager === null}
                />
              </div>
              <div className="flex justify-center h-full w-14">
                <Image
                  src={VolUp}
                  alt="Icon for showing the volume up side of the volume slider"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row flex-1 overflow-auto gap-5">
            <div className="flex flex-col w-5/12">
              <div className="secondaryText">Speed</div>
              <div className="flex h-full w-full items-center">
                <SpeedModulator speedValue={speed} onChange={setSpeed} />
              </div>
            </div>
            <div className="flex h-full w-full flex-col flex-1">
              <div className="secondaryText">Tools</div>
              <div className="flex flex-wrap gap-5 h-full w-full items-center overflow-auto pt-6">
                {buttonInfo.map((button, i) => {
                  return (
                    <div key={i} className="flex flex-col">
                      <Button
                        width="65px"
                        height="50px"
                        image={button.image}
                        onClick={button.onClick}
                      />
                      <div className="flex justify-center font-bold">
                        {button.name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

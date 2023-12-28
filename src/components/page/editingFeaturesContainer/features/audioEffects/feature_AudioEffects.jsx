import { useEffect, useState } from "react";

import Slider from "@/components/misc/slider";
// Copied and pasted and changed from feature_FrequencyFiltering.jsx
export default function Feature_AudioEffects(props) {
  const [sliderDistortion, setSliderDistortion] = useState(0); // distortion slider value
  const [sliderReverb, setSliderReverb] = useState(0); // reverb slider value
  const [sliderBitcrush, setSliderBitcrush] = useState(0); // bitcrush slider value
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    props.manager.editFilter(
      props.selectedSegment,
      "distortion",
      sliderDistortion,
    );
  }, [sliderDistortion]);
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    props.manager.editFilter(props.selectedSegment, "reverb", sliderReverb);
  }, [sliderReverb]);
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    props.manager.editFilter(props.selectedSegment, "bitcrush", sliderBitcrush);
  }, [sliderBitcrush]);
  // When the selected segment changes, the sliders need to adjust their value to reflect the saved edits of that
  // segment.
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    setSliderDistortion(
      props.manager.segments[props.selectedSegment].edits.filters.distortion
        .frequency,
    );
    setSliderReverb(
      props.manager.segments[props.selectedSegment].edits.filters.reverb
        .frequency,
    );
    setSliderBitcrush(
      props.manager.segments[props.selectedSegment].edits.filters.bitcrush
        .frequency,
    );
  }, [props.selectedSegment]);
  return (
    <div className="featureContainer">
      <div className="flex flex-col h-full w-full p-5 gap-5">
        <div className="flex h-12 primaryText">Audio Effects</div>
        <div className="flex flex-col h-full">
          <div className="h-1/3 w-full">
            <div className="flex items-end h-1/2 secondaryText">Distortion</div>
            <div className="relative flex justify-center items-center h-1/2 w-full">
              <Slider
                min={0}
                max={4}
                step={0.1}
                label={""}
                sliderValue={sliderDistortion}
                onChange={setSliderDistortion}
                disabled={props.manager === null}
              />
            </div>
          </div>
          <div className="h-1/3 w-full">
            <div className="flex items-end h-1/2 secondaryText">Reverb</div>
            <div className="relative flex justify-center items-center h-1/2 w-full">
              <Slider
                min={0}
                max={5}
                label={" Decay"}
                sliderValue={sliderReverb}
                onChange={setSliderReverb}
                disabled={props.manager === null}
              />
            </div>
          </div>
          <div className="h-1/3 w-full">
            <div className="flex items-end h-1/2 secondaryText">Bit Crush</div>
            <div className="relative flex justify-center items-center h-1/2 w-full">
              <Slider
                min={0}
                max={20}
                label={" Bits"}
                sliderValue={sliderBitcrush}
                onChange={setSliderBitcrush}
                disabled={props.manager === null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

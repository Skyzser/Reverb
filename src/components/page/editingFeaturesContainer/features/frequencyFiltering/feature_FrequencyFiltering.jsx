import { useEffect, useState } from "react";

import Slider from "@/components/misc/slider";

export default function Feature_FrequencyFiltering(props) {
  const [sliderValueLP, setSliderValueLP] = useState(0); // Low pass slider value
  const [sliderValueHP, setSliderValueHP] = useState(0); // High pass slider value
  const [sliderValueBP, setSliderValueBP] = useState(0); // Band pass slider value
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    props.manager.editFilter(props.selectedSegment, "lowpass", sliderValueLP);
  }, [sliderValueLP]);
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    props.manager.editFilter(props.selectedSegment, "highpass", sliderValueHP);
  }, [sliderValueHP]);
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    props.manager.editFilter(props.selectedSegment, "bandpass", sliderValueBP);
  }, [sliderValueBP]);
  // When the selected segment changes, the sliders need to adjust their value to reflect the saved edits of that
  // segment.
  useEffect(() => {
    if (props.manager === null) {
      return;
    }
    setSliderValueLP(
      props.manager.segments[props.selectedSegment].edits.filters.lowpass
        .frequency,
    );
    setSliderValueHP(
      props.manager.segments[props.selectedSegment].edits.filters.highpass
        .frequency,
    );
    setSliderValueBP(
      props.manager.segments[props.selectedSegment].edits.filters.bandpass
        .frequency,
    );
  }, [props.selectedSegment]);
  return (
    <div className="featureContainer">
      <div className="flex flex-col h-full w-full p-5 gap-5">
        <div className="flex h-12 primaryText">Frequency Filtering</div>
        <div className="flex flex-col h-full">
          <div className="h-1/3 w-full">
            <div className="flex items-end h-1/2 secondaryText">Low Pass</div>
            <div className="relative flex justify-center items-center h-1/2 w-full">
              <Slider
                min={0}
                max={50000}
                label={"Hz"}
                sliderValue={sliderValueLP}
                onChange={setSliderValueLP}
                disabled={props.manager === null}
              />
            </div>
          </div>
          <div className="h-1/3 w-full">
            <div className="flex items-end h-1/2 secondaryText">High Pass</div>
            <div className="relative flex justify-center items-center h-1/2 w-full">
              <Slider
                min={0}
                max={50000}
                label={"Hz"}
                sliderValue={sliderValueHP}
                onChange={setSliderValueHP}
                disabled={props.manager === null}
              />
            </div>
          </div>
          <div className="h-1/3 w-full">
            <div className="flex items-end h-1/2 secondaryText">Band Pass</div>
            <div className="relative flex justify-center items-center h-1/2 w-full">
              <Slider
                min={0}
                max={50000}
                label={"Hz"}
                sliderValue={sliderValueBP}
                onChange={setSliderValueBP}
                disabled={props.manager === null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

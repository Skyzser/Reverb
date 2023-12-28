import { useEffect, useReducer, useRef, useState } from "react";
import * as Tone from "tone";
import WaveSurfer from "wavesurfer.js";
import { toast } from "react-hot-toast";

export default function AudioVisualizer(props) {
  const [mousePercentageList, setMousePercentageList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);
  const [waveform, SetWaveform] = useState(null);
  useEffect(() => {
    // See https://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly
    setMousePercentageList(
      mousePercentageList.sort(function (a, b) {
        return a - b;
      }),
    );
    // We need to rerender the component so the correct lines are highlighted.
    // See https://legacy.reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    // on how to force a component to rerender
    forceUpdate();
  }, [mousePercentageList]);
  // This function gets the current mouse position relative to the div this function is called in.
  // It then collects all the mouse positions in an array to be used to draw the lines.
  const handleMouseXPosition = (e) => {
    if (props.manager === null) {
      toast.error("No audio file loaded!");
      return null;
    }
    let rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;

    let rectWidth = rect.right - rect.left;
    let percentage = Math.round((x / rectWidth) * 100);
    // Do separate actions if we are in select or cut mode
    if (props.mode === "select") {
      // If there is no split then the first segment is the only one
      if (mousePercentageList.length === 0) {
        props.setSegment(0);
        return;
      }
      let count = 0;
      // Iterate through the %s, once we hit a % that is greater than the selected value then that is our segment
      for (let i = 0; i < mousePercentageList.length; i++) {
        if (percentage <= mousePercentageList[i]) {
          break;
        }
        count++;
      }
      props.setSegment(count);
    } else {
      // When cutting, multiply the duration by the % in order to cut at the correct time
      if (mousePercentageList.includes(percentage)) {
        toast.error("You cannot cut at the same point twice!");
        return;
      }
      props.manager.createSegment(props.manager.duration * (percentage / 100));
      // Append % to list
      setMousePercentageList((prevPercentages) => [
        ...prevPercentages,
        percentage,
      ]);
    }
  };

  // See https://stackoverflow.com/a/59379509 for how to use wavesurfer.js in React
  const waveformRef = useRef();
  useEffect(() => {
    // See https://github.com/Tonejs/Tone.js/issues/612 for best way to combine wavesurfer.js and Tone.js
    // We should use the audio context given to us by Tone.js to avoid recreating the same resources.
    if (props.manager === null || props.manager === undefined) {
      return;
    }
    // loadDecodedBlob was removed so we have to turn the audioBuffer into a blob instead.
    // See https://github.com/katspaugh/wavesurfer.js/discussions/3201 for how this is done.
    // We turn audiOBuffer into a Blob and then we have the wavesurfer load the created blob.
    // This allows us to avoid re-decoding the audio buffer.
    const blob = new Blob([props.manager.decodedBuffer], { type: "audio/wav" });
    const peaks = [
      props.manager.decodedBuffer.getChannelData(0),
      props.manager.decodedBuffer.getChannelData(1),
    ];
    const duration = props.manager.decodedBuffer.duration;
    // If the waveform is null create a new one
    if (waveform === null) {
      let tempWaveform = WaveSurfer.create({
        container: waveformRef.current,
        audioContest: Tone.getContext().rawContext._nativeAudioContext,
        height: "auto",
        interact: "false",
      });
      tempWaveform.loadBlob(blob, peaks, duration);
      SetWaveform(tempWaveform);
      return;
    }
    // Otherwise use the existing one to load a new blob
    waveform.loadBlob(blob, peaks, duration);
  }, [props.manager]);

  // Ternary statement makes the lines red instead of orange for the left and right line of the selected segment
  return (
    <>
      <div
        className="relative w-full h-full bg-black mainBorderRadius"
        onClick={handleMouseXPosition}
      >
        {/* See https://stackoverflow.com/a/9909242 . We use absolute to allow the lines to go over the audio graph*/}
        <div
          className={"absolute w-full h-full bg-black mainBorderRadius -z-0"}
          ref={waveformRef}
        ></div>
        {mousePercentageList.map((percentage, i) => {
          return props.selectedSegment === i ||
            props.selectedSegment - 1 === i ? (
            <div
              key={i}
              className="h-full w-0.5 border-dotted border-2 border-red-400"
              style={{ left: `${percentage}%`, position: "absolute" }}
            ></div>
          ) : (
            <div
              key={i}
              className="h-full w-0.5 bg-orange-400"
              style={{ left: `${percentage}%`, position: "absolute" }}
            ></div>
          );
        })}
      </div>
    </>
  );
}

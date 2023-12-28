import { Slider as Slide } from "@mui/material";

export default function Slider({
  defaultValue = 0,
  min,
  max,
  step = 1,
  label = "dB",
  disabled = false,
  sliderValue,
  onChange,
}) {
  // SLider component which takes in all those values so that it could be highly customisable
  return (
    <>
      <Slide
        aria-label="Volume Slider"
        defaultValue={defaultValue}
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        valueLabelDisplay="auto"
        disabled={disabled}
        sx={{
          height: 20,
          color: "#FFFFFF",
          "& .MuiSlider-track": {
            backgroundColor: "#00E291",
            border: "none",
          },
          "& .MuiSlider-thumb": {
            display: "none",
          },
        }}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute font-bold mainTextColour select-none pointer-events-none">
        {sliderValue}
        {label}
      </div>
    </>
  );
}

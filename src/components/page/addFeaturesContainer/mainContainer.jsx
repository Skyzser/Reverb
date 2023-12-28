import { useState } from "react";

import Button from "@/components/misc/button";
import Add from "../addFeaturesContainer/svg/Add.svg";

export default function AddFeaturesContainer({
  featuresList,
  setFeaturesList,
}) {
  // This is where the logic for the button that displays what features can be added (will have less features shown the more that are added)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const handleClick = (e) => {
    let currentFeatureName = e.target.innerHTML; // Check for the name of the feature
    let newFeaturesList = [...featuresList]; // Copy the features list to a new array
    newFeaturesList.forEach((feature) => {
      // If the feature name matches the current feature name, then set the hidden value to false, hence showing the feature
      if (feature.name === currentFeatureName) {
        feature.hidden = false;
      }
    });
    setFeaturesList(newFeaturesList); // Update the features list
    setShowFeaturesDropdown(false); // Hide the dropdown
  };
  return (
    <div className="flex flex-col justify-end w-24 h-full overflow-hidden">
      {showFeaturesDropdown ? (
        <div className="absolute flex flex-col h-auto w-48 bottom-24 right-5 z-50 items-center gap-5 miscBox pt-5 pb-5">
          {featuresList.map((feature, i) => {
            return (
              <div key={i}>
                {feature.hidden ? (
                  <div className="cursor-pointer" onClick={handleClick}>
                    {feature.name}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-end items-end w-full h-24 pb-1 pe-1">
        <Button
          width="70px"
          height="70px"
          image={Add}
          onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
        />
      </div>
    </div>
  );
}

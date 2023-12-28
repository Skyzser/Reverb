import Feature_General from "./features/general/feature_General";
import Feature_FrequencyFiltering from "./features/frequencyFiltering/feature_FrequencyFiltering";
import Feature_AudioEffects from "@/components/page/editingFeaturesContainer/features/audioEffects/feature_AudioEffects";
import Button from "@/components/misc/button";
import Exit from "@/svg/Exit.svg";

export default function EditingFeaturesContainer(props) {
  // This is the main container for all the features that get shown on the editor
  // This is the list of features that currently can be added to the editor
  const componentList = [
    {
      name: "Frequency Filtering",
      component: <Feature_FrequencyFiltering {...props} />,
    },
    {
      name: "Audio Effects",
      component: <Feature_AudioEffects {...props} />,
    },
  ];
  const handleClick = (currentFeatureName) => {
    let newFeaturesList = [...props.featuresList]; // Copy the features list to a new array
    newFeaturesList.forEach((feature) => {
      // If the feature name matches the current feature name, then set the hidden value to true, hence hiding the feature
      if (feature.name === currentFeatureName) {
        feature.hidden = true;
      }
    });
    props.setFeaturesList(newFeaturesList); // Update the features list
  };

  return (
    <div className="flex flex-wrap gap-5 h-full w-full overflow-auto pe-5">
      <Feature_General {...props} />
      {componentList.map((component, i) => {
        return (
          <div
            className={`${
              props.featuresList[i].hidden ? "hidden" : ""
            } relative optionalFeature`}
            key={i}
          >
            <div className="removeButton absolute right-5 top-5">
              <Button
                width="40px"
                height="40px"
                image={Exit}
                onClick={() => handleClick(component.name)}
              />
            </div>
            {component.component}
          </div>
        );
      })}
    </div>
  );
}

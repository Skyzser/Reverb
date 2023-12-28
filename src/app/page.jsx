"use client";

import AudioVisualizer from "@/components/page/audioVisualisation/audioVisualiser";
import EditingFeaturesContainer from "@/components/page/editingFeaturesContainer/mainContainer";
import AddFeaturesContainer from "@/components/page/addFeaturesContainer/mainContainer";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/navbar/navbar";
import Button from "@/components/misc/button";

import Exit from "../svg/Exit.svg";

import * as util from "@/util/audio_utils";

export default function Home() {
  // These are all the useStates for the logic (backend)
  const [mode, setMode] = useState("select");
  const [selectedSegment, setSegment] = useState(0);
  const [manager, setManager] = useState(null);

  // These is the useStates for displaying the container for file information and the actual file information to be displayed
  const [fileInfoContainer, setFileInfoContainer] = useState(false);
  const [fileInfo, setFileInfo] = useState([]);

  // This is the useState for the list of features currently added to the editor
  const [featuresList, setFeaturesList] = useState([
    {
      name: "Frequency Filtering",
      hidden: true,
    },
    {
      name: "Audio Effects",
      hidden: true,
    },
  ]);

  // Anytime the manager is changed, update the file information
  useEffect(() => {
    if (fileInfoContainer) {
      setFileInfo(util.GetFileInfo(manager));
    }
  }, [fileInfoContainer, manager]);

  return (
    <>
      {/* This file information container only appears if the variable is true */}
      {fileInfoContainer ? (
        <div
          className="absolute flex justify-center h-full w-full z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="absolute top-96 flex flex-col min-w-fit w-1/4 min-h-fit h-1/3 miscBox pe-5 ps-5">
            <div className="flex justify-between items-center w-full h-1/4">
              <div className="primaryText">File Info</div>
              <Button
                width="64px"
                height="40px"
                image={Exit}
                onClick={() => setFileInfoContainer(false)}
              />
            </div>
            <div className="flex flex-col h-full w-full">
              {fileInfo ? (
                <>
                  <div className="flex items-center h-1/4 secondaryText">
                    Name: {fileInfo.name}
                  </div>
                  <div className="flex items-center h-1/4 secondaryText">
                    Duration: {fileInfo.duration} seconds
                  </div>
                  <div className="flex items-center h-1/4 secondaryText">
                    Size: {(fileInfo.size / 1000000).toFixed(3)} MB
                  </div>
                  <div className="flex items-center h-1/4 secondaryText">
                    File Type: {fileInfo.type}
                  </div>
                </>
              ) : (
                <div className="flex items-center h-1/4 secondaryText">
                  No audio file loaded
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* This is the navbar that appears at the top of the page */}
      <Navbar
        manager={manager}
        setManager={setManager}
        setFileInfoContainer={setFileInfoContainer}
      />
      <div className="flex flex-1 p-5 overflow-auto">
        <div className="flex flex-col gap-y-5 h-full w-full">
          <div className="w-full" style={{ height: "400px" }}>
            {/* This is the audio visualiser component */}
            <AudioVisualizer
              mode={mode}
              setMode={setMode}
              setSegment={setSegment}
              selectedSegment={selectedSegment}
              manager={manager}
            />
          </div>
          <div className="flex flex-row flex-1 h-full w-full overflow-auto">
            {/* This is the container for all the features that could be displayed in the editor */}
            <EditingFeaturesContainer
              setMode={setMode}
              selectedSegment={selectedSegment}
              manager={manager}
              featuresList={featuresList}
              setFeaturesList={setFeaturesList}
            />
            {/* This is the component for adding new features */}
            <AddFeaturesContainer
              featuresList={featuresList}
              setFeaturesList={setFeaturesList}
            />
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState, useRef } from "react";

import * as util from "@/util/audio_utils";
import Button from "@/components/misc/button";

import PlayPause from "../navbar/svg/PlayPause.svg";
import Info from "../navbar/svg/Info.svg";
import Save from "../navbar/svg/Save.svg";
import NewFile from "../navbar/svg/NewFile.svg";
import Menu from "../navbar/svg/Menu.svg";

export default function Navbar(props) {
  // https://stackoverflow.com/questions/37457128/react-open-file-browser-on-click-a-div
  // Reference on how to use an invisible file input to open file browser when clicking on the image
  const inputFile = useRef(null);
  async function handleSettingManager(e) {
    let manager = await util.OnFileChange(e);
    if (manager !== null && manager !== undefined) {
      props.setManager(manager);
    }
  }
  // Information for each navigation item so that it could be mapped dynamically by only adding or removing entries from this array
  const buttonInfo = [
    {
      name: "Play/Pause",
      image: PlayPause,
      onClick: () => {
        util.PlayAudio(props.manager);
        setShowNavbarDropdown(false);
      },
      extraDiv: <></>,
    },
    {
      name: "File Info",
      image: Info,
      onClick: () => {
        props.setFileInfoContainer(true);
        setShowNavbarDropdown(false);
      },
      extraDiv: <></>,
    },
    {
      name: "Save",
      image: Save,
      onClick: () => {
        util.DownloadAudio(props.manager);
        setShowNavbarDropdown(false);
      },
      extraDiv: <></>,
    },
    {
      name: "New File",
      image: NewFile,
      onClick: () => {
        inputFile.current.click();
      },
      extraDiv: (
        <input
          type="file"
          ref={inputFile}
          className="hidden invisible"
          onChange={async (e) => {
            handleSettingManager(e);
            setShowNavbarDropdown(false);
          }}
        />
      ),
    },
  ];

  const [showNavbarDropdown, setShowNavbarDropdown] = useState(false);

  return (
    <div className="flex h-24 border-b-2" style={{ borderColor: "#DDE6ED" }}>
      {/* This is only shown when the screen width is below a certain width so that all the navigation bar options are still available without be squashed */}
      {showNavbarDropdown ? (
        <div className="md:hidden absolute flex flex-col h-auto w-48 top-20 right-5 z-50 items-center gap-5 miscBox pt-5 pb-5">
          {buttonInfo.slice(0, 3).map((item, i) => {
            return (
              <Button
                key={i}
                width="65%"
                height="60px"
                image={item.image}
                onClick={item.onClick}
              />
            );
          })}
          <Button
            width="65%"
            height="60px"
            image={buttonInfo[3].image}
            onClick={buttonInfo[3].onClick}
            extraDiv={buttonInfo[3].extraDiv}
          />
        </div>
      ) : (
        <></>
      )}
      <div className="flex justify-center items-center ps-5 pe-5 border-r-2">
        <h1 className="titleText">REVERB</h1>
      </div>
      <div className="flex md:hidden w-full p-5 justify-end items-center">
        {/* This is the hamburger menu that appears when the screen width is below a certain width */}
        <Button
          width="93px"
          height="100%"
          image={Menu}
          onClick={() => setShowNavbarDropdown(!showNavbarDropdown)}
        />
      </div>
      <div className="hidden md:flex flex-nowrap w-full p-5 justify-between items-center">
        <div className="flex flex-row w-auto h-full gap-10">
          {/* The reason for slicing is so that I could have the last navigation bar list item be mapped at the end */}
          {buttonInfo.slice(0, 3).map((button, i) => {
            return (
              <Button
                key={i}
                width="93px"
                height="100%"
                image={button.image}
                onClick={button.onClick}
              />
            );
          })}
        </div>
        <div className="flex flex-row w-auto h-full">
          <Button
            width="93px"
            height="100%"
            image={buttonInfo[3].image}
            onClick={buttonInfo[3].onClick}
            extraDiv={buttonInfo[3].extraDiv}
          />
        </div>
      </div>
    </div>
  );
}

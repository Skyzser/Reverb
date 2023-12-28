import * as Tone from "tone";
import BufferManager from "./buffer_manager";
import { toast } from "react-hot-toast";

export var SUPPORTED_TYPES = ["audio/x-wav", "audio/wav"];

// This function creates a buffer manager when a file input is changed
export async function OnFileChange(e) {
  // eslint-disable-next-line no-unused-vars
  const audioContext = new AudioContext();
  await Tone.start();
  const file = e.target.files[0];
  if (!SUPPORTED_TYPES.includes(file.type)) {
    let type = String(file.type);
    // No idea why template literal is not working here
    toast.error(type + " is not a supported file type!");
    return;
  }
  toast.success("Successfully uploaded file " + file.name);
  const url = URL.createObjectURL(file);
  let player = new Tone.Player({});
  await player.load(url);
  let bufferManager = new BufferManager(player.buffer);
  bufferManager.fileInfo = {
    name: file.name,
    duration: bufferManager.duration,
    size: file.size,
    type: file.type,
  };
  bufferManager.decodedBuffer = player.buffer;
  return bufferManager;
}

// This is a simple function to test different features of the BufferManager, do not call it!
export async function TestBufferManagerOnFileChange(e) {
  // eslint-disable-next-line no-unused-vars
  const audioContext = new AudioContext();
  await Tone.start();
  const file = e.target.files[0];
  if (!SUPPORTED_TYPES.includes(file.type)) {
    toast.error`${file.type} is not a supported file type!`;
  }
  const url = URL.createObjectURL(file);
  let player = new Tone.Player({});
  await player.load(url);
  toast.success("Successfully uploaded file " + file.name);
  let bufferManager = new BufferManager(player.buffer);
  bufferManager.createSegment(3);
  bufferManager.mergeSegment(0);
  bufferManager.editVolume(0, 10);
  bufferManager.editPlaybackRate(0, 0.5);
  bufferManager.editReverse(0);
  return bufferManager;
}

export function GetFileInfo(manager) {
  if (manager === null) {
    return;
  }
  return manager.getFileInfo();
}
export async function PlayAudio(manager) {
  if (manager === null) {
    toast.error("No audio file loaded!");
    return;
  }
  await Tone.start();
  manager.play();
}

// ChangeVolume takes in the player and the change in integers of the decibels of the volume
export async function ChangeVolume(manager, change, index) {
  if (manager === null) {
    toast.error("No audio file loaded!");
    return;
  }
  await Tone.start();
  manager.editVolume(index, change);
}

// Toggles the 'deleted' flag to skip and restore segments.
export async function ToggleDelete(manager, index) {
  if (manager === null) {
    return;
  }
  await Tone.start();
  manager.toggleDisableSegment(index);
}
// ChangePlaybackRate changes the speed the audio is played at. 0.25 = 1/4 rate
export async function ChangePlaybackRate(manager, change, index) {
  if (manager === null) {
    toast.error("No audio file loaded!");
    return;
  }
  await Tone.start();
  manager.editPlaybackRate(index, change);
}

export async function DownloadAudio(manager) {
  if (manager === null) {
    toast.error("No audio file loaded!");
    return;
  }
  await Tone.start();
  // replace with callback
  manager.download(null);
}
// This is a test function only, do not use
export function TestFilter(manager) {
  manager.editFilter(0, "lowpass", 1500);
  manager.editFilter(0, "highpass", 1500);
  manager.editFilter(0, "bandpass", 1500);
}

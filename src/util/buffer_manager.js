import * as Tone from "tone";
import audioBufferToWav from "./vendor/audiobuffer-to-wav";

const supportedFilters = [
  "lowpass",
  "highpass",
  "bandpass",
  "distortion",
  "reverb",
  "bitcrush",
];
export default class BufferManager {
  duration;
  segments;
  playing;
  fileInfo;
  decodedBuffer;
  currentPlayers;

  constructor(audioBuffer) {
    this.segments = [];
    this.duration = audioBuffer.duration;
    this.segments.push(new BufferSegment(0, audioBuffer));
    this.playing = false;
  }

  // createSegment creates a new segment at the threshold specified in seconds. It splits the existing segment which
  // owns that buffer.
  createSegment(threshold) {
    if (threshold >= this.duration) {
      throw `threshold to create segment at must be greater than the duration of the file ${this.duration}`;
    }
    if (threshold <= 0) {
      throw "threshold must be greater than zero";
    }
    let segIndex = -1;
    let segmentToCut = null;
    // Iterate through the segments until the segment ahead has a threshold higher than our threshold
    for (let i = 0; i < this.segments.length; i++) {
      let curr = this.segments[i];
      // If we are at the last segment then this is where we must cut
      if (i === this.segments.length - 1) {
        segIndex = i;
        segmentToCut = curr;
        break;
      }
      // When the segment ahead has a higher threshold, we are at the correct segment
      if (this.segments[i + 1].threshold > threshold) {
        segIndex = i;
        segmentToCut = curr;
        break;
      }
    }

    if (segmentToCut === null || segIndex === -1) {
      throw "unexpected error, segmentToCut is null or segIndex is -1. This should never happen";
    }
    // Split the segment and insert it into the array
    let sliceLoc = threshold - segmentToCut.threshold;
    let splitSegments = segmentToCut.split(sliceLoc);

    this.segments[segIndex] = splitSegments.left;
    // Ref: https://stackoverflow.com/questions/586182/how-to-insert-an-item-into-an-array-at-a-specific-index
    this.segments.splice(segIndex + 1, 0, splitSegments.right);
  }

  // mergeSegment merges segment at index i with the segment in front of it
  mergeSegment(i) {
    if (i + 1 >= this.segments.length) {
      throw "there must at least 1 segment after segment i";
    }
    this.segments[i].merge(this.segments[i + 1]);
    this.segments.splice(i + 1, 1);
  }

  editVolume(i, volumeChange) {
    this.segments[i].edits.volume = volumeChange;
  }

  editPlaybackRate(i, playbackRate) {
    this.segments[i].edits.playbackRate = playbackRate;
  }

  editReverse(i, reverse) {
    this.segments[i].edits.reverse = reverse;
  }

  editFilter(i, filter, freq) {
    if (!supportedFilters.includes(filter)) {
      throw `${filter} is not a supported filter`;
    }
    this.segments[i].edits.filters[filter].frequency = freq;
  }
  toggleDisableSegment(i) {
    this.segments[i].edits.deleted = !this.segments[i].edits.deleted;
  }

  getFileInfo() {
    return this.fileInfo;
  }

  // We pass in a context ONLY when we converted an audio to a downloaded file. This is because we need to set
  // the destination to OfflineContext not regular Destination
  // See https://github.com/Tonejs/Tone.js/issues/1043
  async play(context) {
    await Tone.start();
    if (this.playing) {
      console.log("Pausing...");
      // Iterate through the list of players and stop and dispose all of them to pause the audio
      for (let i = 0; i < this.currentPlayers.length; i++) {
        this.currentPlayers[i].stop();
        this.currentPlayers[i].dispose();
      }
      this.currentPlayers = [];
      this.playing = false;
      return;
    }
    console.log("Playing");
    this.currentPlayers = [];
    // Otherwise we iterate through all the segments and create a player for each one
    for (let i = 0; i < this.segments.length; i++) {
      // Skip segments which are marked as deleted.
      if (this.segments[i].edits.deleted) {
        continue;
      }
      this.currentPlayers.push(this.segments[i].createPlayer(context));
    }
    // Set it up so that when each player stops (finishes their segment), start the next one
    for (let i = 0; i < this.currentPlayers.length - 1; i++) {
      this.currentPlayers[i].onstop = () => {
        this.currentPlayers[i + 1].start();
      };
    }
    // Early exit if there are no players i.e. all segments are deleted
    if (this.currentPlayers.length === 0) {
      return;
    }
    // Set playing to false when the last player finishes
    this.currentPlayers[this.currentPlayers.length - 1].onstop = () => {
      this.playing = false;
    };
    // After all the audio buffers are loaded, start the first player
    Tone.loaded().then(() => {
      this.currentPlayers[0].start();
      this.playing = true;
    });
  }

  async download() {
    // Reference: https://tonejs.github.io/docs/14.7.77/fn/Offline
    Tone.Offline((context) => {
      this.play(context);
    }, this.duration).then((buffer) => {
      // convert buffer to file using buffer-to-wav package
      let wavBuffer = audioBufferToWav(buffer._buffer);
      let blob = new Blob([wavBuffer], { type: "audio/wav" });
      let url = URL.createObjectURL(blob);
      // See Brian Li's answer on Stackoverflow: https://stackoverflow.com/a/63965930 on how to download files in
      // React.
      let downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.setAttribute("download", `reverbEdit.pdf`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.parentNode.removeChild(downloadLink);
      console.log("Created download link");
    });
  }
}

export class BufferSegment {
  threshold;
  buff;
  edits;

  constructor(threshold, buffer) {
    this.threshold = threshold;
    this.buff = buffer;
    this.edits = new Edits();
  }

  // Splits the buffer segment into two at the sliceLoc point
  split(sliceLoc) {
    let lBuffer = this.buff.slice(0, sliceLoc);
    let rBuffer = this.buff.slice(sliceLoc);
    let leftSegment = new BufferSegment(this.threshold, lBuffer);
    let rightSegment = new BufferSegment(sliceLoc + this.threshold, rBuffer);
    // Clone and assign existing edits
    // We do not use structuredClone because structuredClone does not clone function objects in the underlying objects...
    // This causes our code to err out as createFilters is not defined. Making our own clone method fixes this.
    // Figured this out as our program was crashing but also found this article on it
    // https://web.dev/articles/structured-clone#features_and_limitations
    leftSegment.edits = this.edits.clone();
    rightSegment.edits = this.edits.clone();
    return { left: leftSegment, right: rightSegment };
  }

  // merges left segment with the right segment
  merge(rightSeg) {
    this.buff = appendBuffer(this.buff, rightSeg.buff);
  }

  // We pass in a context ONLY when we converted an audio to a downloaded file. This is because we need to set
  // the destination to OfflineContext not regular Destination
  // See https://github.com/Tonejs/Tone.js/issues/1043
  createPlayer(context) {
    let player = new Tone.Player({
      url: this.buff,
    });
    if (this.edits.volume !== null) {
      player.volume.value = this.edits.volume;
    }
    if (this.edits.playbackRate !== null) {
      player.playbackRate = this.edits.playbackRate;
    }
    if (this.edits.reverse !== null) {
      player.reverse = this.edits.reverse;
    }
    let filterNodes = this.edits.createFilters();
    let destination = null;
    if (context === undefined) {
      destination = Tone.Destination;
    } else {
      destination = context.destination;
    }
    return player.chain(...filterNodes, destination);
  }
}

export class Edits {
  constructor() {
    this.volume = 0;
    this.playbackRate = 1;
    this.reverse = false;
    this.deleted = false;
    this.filters = {
      lowpass: {
        frequency: 0,
      },
      highpass: {
        frequency: 0,
      },
      bandpass: {
        frequency: 0,
      },
      distortion: {
        frequency: 0,
      },
      reverb: {
        frequency: 0,
      },
      bitcrush: {
        frequency: 0,
      },
    };
  }

  createFilters() {
    let myFilters = [];
    // Ref: https://stackoverflow.com/questions/7241878/for-in-loops-in-javascript-key-value-pairs
    // for how to iterate through an objects keys and values
    for (const [key, value] of Object.entries(this.filters)) {
      if (value.frequency !== 0) {
        if (key === "distortion") {
          myFilters.push(new Tone.Distortion(value.frequency));
          continue;
        } else if (key === "reverb") {
          myFilters.push(new Tone.Reverb(value.frequency));
          continue;
        } else if (key === "bitcrush") {
          myFilters.push(new Tone.BitCrusher(value.frequency));
          continue;
        }
        console.log(key);
        myFilters.push(new Tone.Filter(value.frequency, key));
      }
    }
    return myFilters;
  }

  clone() {
    let clone = new Edits();
    clone.volume = this.volume;
    clone.playbackRate = this.playbackRate;
    clone.reverse = this.reverse;
    clone.deleted = this.deleted;
    clone.filters = {
      lowpass: {
        frequency: this.filters.lowpass.frequency,
      },
      highpass: {
        frequency: this.filters.highpass.frequency,
      },
      bandpass: {
        frequency: this.filters.bandpass.frequency,
      },
      distortion: {
        frequency: this.filters.distortion.frequency,
      },
      reverb: {
        frequency: this.filters.reverb.frequency,
      },
      bitcrush: {
        frequency: this.filters.bitcrush.frequency,
      },
    };
    return clone;
  }

  volume;
  playbackRate;
  reverse;
  filters;
  // boolean flag to determine if the segment should be skipped
  deleted;
}

// Code for appending audio buffers taken from https://stackoverflow.com/a/14148125
function appendBuffer(buffer1, buffer2) {
  let rawBuffer1 = buffer1._buffer;
  let rawBuffer2 = buffer2._buffer;
  const numberOfChannels = Math.min(
    rawBuffer1.numberOfChannels,
    rawBuffer2.numberOfChannels,
  );
  let context = Tone.context;
  const tmp = context.createBuffer(
    numberOfChannels,
    rawBuffer1.length + rawBuffer2.length,
    rawBuffer1.sampleRate,
  );
  for (let i = 0; i < numberOfChannels; i++) {
    const channel = tmp.getChannelData(i);
    channel.set(rawBuffer1.getChannelData(i), 0);
    channel.set(rawBuffer2.getChannelData(i), rawBuffer1.length);
  }
  buffer1._buffer = tmp;
  return buffer1;
}

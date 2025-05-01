import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// /**
//  * Extracts audio from a video file and returns it as an MP3 blob
//  * @param videoBlob The input video blob to extract audio from
//  * @returns Promise<Blob> The extracted audio as an MP3 blob
//  */
// export async function extractAudioFromVideo(videoBlob: Blob): Promise<Blob> {
//   try {
//     const ffmpeg = new FFmpeg();
//     // Load FFmpeg if not already loaded
//     if (!ffmpeg.loaded) {
//       const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.9/dist/umd";
//       await ffmpeg.load({
//         coreURL: await toBlobURL(
//           `${baseURL}/ffmpeg-core.js`,
//           "text/javascript"
//         ),
//         wasmURL: await toBlobURL(
//           `${baseURL}/ffmpeg-core.wasm`,
//           "application/wasm"
//         ),
//         workerURL: await toBlobURL(
//           `${baseURL}/ffmpeg-core.worker.js`,
//           "text/javascript"
//         ),
//       });
//     }

//     console.log("CONVERTING TO AUDIO [INIT]");

//     // Setup file names
//     const inputFileName = "input.mp4";
//     const outputFileName = "output.mp3";

//     // Write the input video file
//     await ffmpeg.writeFile(inputFileName, await fetchFile(videoBlob));

//     // Extract audio using FFmpeg
//     await ffmpeg.exec([
//       "-i",
//       inputFileName,
//       "-vn", // Disable video
//       "-acodec",
//       "libmp3lame", // Use MP3 codec
//       "-q:a",
//       "2", // Set audio quality (0-9, lower means better quality)
//       "-y", // Overwrite output file if it exists
//       outputFileName,
//     ]);

//     // Read the output file
//     const data = await ffmpeg.readFile(outputFileName);
//     console.log("CONVERTING TO AUDIO [complete]", data);

//     // Convert the output to a Blob
//     return new Blob([data], { type: "audio/mp3" });
//   } catch (error) {
//     console.error("Error in extractAudioFromVideo:", error);
//     throw error;
//   }
// }

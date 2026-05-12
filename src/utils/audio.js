export function getAudioDuration(audioLink) {
  return new Promise((resolve) => {
    if (!audioLink) {
      resolve(null);
      return;
    }

    const audio = new Audio();
    audio.preload = "metadata";

    audio.onloadedmetadata = () => {
      const secs = audio.duration;
      audio.src = "";

      if (!isFinite(secs)) {
        resolve(null);
        return;
      }

      const m = Math.floor(secs / 60);
      const s = Math.floor(secs % 60);
      resolve(`${m}:${String(s).padStart(2, "0")}`);
    };

    audio.onerror = () => resolve(null);
    audio.src = audioLink;
  });
}

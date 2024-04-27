const axios = require("axios").default;
const FormData = require("form-data");
const acrcloud = require('./acloud')
const fs = require("fs").promises;
const Jimp = require("jimp");
const ffmpeg = require("fluent-ffmpeg");
const util = require("util");
const { sizeFormatter } = require("human-readable");

const getRandom = (num) => `${Math.floor(Math.random() * 10000)}${num}`;

const isNumber = (number) => Number.isInteger(parseInt(number));

const fetchUrl = async (url, options = {}) => {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
      },
      ...options,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

const isUrl = (url) =>
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(url);

const generateProfilePicture = async (buffer) => {
  const image = await Jimp.read(buffer);
  const scaledImage = await image.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG);
  return { img: scaledImage, preview: scaledImage };
};

const formatTime = (seconds) => {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const formattedTime = [];
  if (d) formattedTime.push(`${d} day${d !== 1 ? "s" : ""}`);
  if (h) formattedTime.push(`${h} hour${h !== 1 ? "s" : ""}`);
  if (m) formattedTime.push(`${m} minute${m !== 1 ? "s" : ""}`);
  if (s) formattedTime.push(`${s} second${s !== 1 ? "s" : ""}`);
  return formattedTime.join(", ");
};
find: async function find(buffer) {
    let acr = new acrcloud({
      host: "identify-eu-west-1.acrcloud.com",
      access_key: "4dcedd3dc6d911b38c988b872afa7e0d",
      access_secret: "U0PEUg2y6yGVh6NwJra2fJkiE1R5sCfiT6COLXuk",
    });
  
    let res = await acr.identify(buffer);
    let { code, m } = res.status;
    if (code !== 0) return m;
    let { title, artists, album, genres, release_date, external_metadata } =
      res.metadata.music[0];
    let { youtube, spotify } = external_metadata;
  
    return {
      status: 200,
      title: title,
      artists: artists !== undefined ? artists.map((v) => v.name).join(", ") : "",
      album: album.name || "",
      genres: genres !== undefined ? genres.map((v) => v.name).join(", ") : "",
      release_date: release_date,
      youtube: `https://www.youtube.com/watch?v=${youtube?.vid}`,
      spotify: `https://open.spotify.com/track/` + spotify?.track?.id,
    }
};
const telegraPhUpload = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    const { data } = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders(),
    });
    return `https://telegra.ph${data[0].src}`;
  } catch (error) {
    throw new Error(error.message);
  }
};

const bufferToGif = async (image) => {
  const filename = `${Math.random().toString(36)}.gif`;
  const gifPath = `./dustbin/${filename}`;
  await fs.writeFile(gifPath, image);
  await new Promise((resolve) => {
    ffmpeg(gifPath)
      .outputOptions(["-movflags faststart", "-pix_fmt yuv420p", "-vf scale=trunc(iw/2)*2:trunc(ih/2)*2"])
      .save(`./dustbin/${filename.replace(".gif", ".mp4")}`)
      .on("end", async () => {
        await Promise.all([
          fs.unlink(`./dustbin/${filename}.mp4`),
          fs.unlink(`./dustbin/${filename}.gif`),
        ]);
        resolve();
      });
  });
  return fs.readFile(`./dustbin/${filename}.mp4`);
};

const getBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

const extractNumbers = (content) => (content.match(/(-?\d+)/g) || []).map((n) => Math.max(parseInt(n), 0));

const extractUrls = (content) => content.match(/(\bhttps?:\/\/\S+)/gi) || [];

module.exports = {
  getRandom,
  isNumber,
  fetchUrl,
  isUrl,
  find,
  generateProfilePicture,
  formatTime,
  telegraPhUpload,
  bufferToGif,
  getBuffer,
  extractNumbers,
  extractUrls,
};

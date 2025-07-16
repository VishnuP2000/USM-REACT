
import axios from "axios";

const UploadImage = async (image) => {
  // const image = event.target
  console.log('image',image)
  if (!image) return;

  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "vishnu");
  data.append("cloud_name", "ddhz5buou");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/ddhz5buou/image/upload",data);
    console.log("Uploaded Image URL:", res.data.secure_url);
    return res.data.secure_url;
  } catch (error) {
    console.error("Upload failed", error);
  }
};

export default UploadImage;

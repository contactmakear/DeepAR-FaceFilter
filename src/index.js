import * as deepar from "deepar";
import Carousel from "./carousel.js";
import Form from "./form";
import { takeScreenshot, displayScreenshot, loadImage, base64ToBlob } from "./camera.js";
import axios from 'axios'
import { hideElement } from "./utils.js";

if (document.querySelector('.register-form')) {
  new Form()
}

if (document.querySelector('#ar-screen')) {
  document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slides");
    const toolbarPhotos = document.querySelectorAll(".slide");
    const carouselInner = document.querySelector(".carousel-slider"); // Assuming only one carousel inner element

    // Click event listeners for each slide
    slides.forEach((slide) => {

    });

    // Initialize by showing the first category (optional)
    slides[0].click();
  })






  // Log the version. Just in case.
  console.log("Deepar version: " + deepar.version);

  // Top-level await is not supported.
  // So we wrap the whole code in an async function that is called immediately.
  (async function () {
    const previewElement = document.getElementById("ar-screen");

    // Trigger loading progress bar animation
    const loadingProgressBar = document.getElementById("loading-progress-bar");
    loadingProgressBar.style.width = "100%";

    // All the effects are in the public/effects folder.
    // Here we define the order of effect files.

    const effectList = [
      "effects/viking_helmet.deepar",
      "effects/Fire_Effect.deepar",
      "effects/galaxy_background_web.deepar",
      "effects/Hope.deepar",
      "effects/Split_View_Look.deepar",
      "effects/Neon_Devil_Horns.deepar",
      "effects/Humanoid.deepar",
      "effects/Vendetta_Mask.deepar",
      "effects/Pixel_Hearts.deepar",
      "effects/Stallone.deepar",
      "effects/Shoes.deepar",
      "effects/Ping_Pong.deepar",
      "effects/Snail.deepar",
      "effects/MakeupLook.deepar",
      "effects/ray-ban-wayfarer.deepar",

    ];

    let deepAR = null;

    try {
      deepAR = await deepar.initialize({
        licenseKey: "2a51777dc1f79fc3c597fb49c754394bf68f897727fb2cdc5d4177ea9976b5e2c682c0175655fff1",
        previewElement: document.querySelector('#ar-screen'),
        effect: effectList[0],
        rootPath: "./deepar-resources",
        additionalOptions: {
          cameraConfig: {
            // facingMode: 'environment'  // Uncomment this line to use the rear camera
          },
        },
      });
    } catch (error) {
      console.error(error);
      document.getElementById("loading-screen").style.display = "none";
      document.getElementById("permission-denied-screen").style.display = "block";
      return;
    }

    // Hide the loading screen.
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("ar-screen").style.display = "block";

    window.effect = effectList[0];

    const glassesCarousel = new Carousel("carousel");
    glassesCarousel.onChange = async (value) => {
      const loadingSpinner = document.getElementById("loading-spinner");

      if (window.effect !== effectList[value]) {
        loadingSpinner.style.display = "block";
        await deepAR.switchEffect(effectList[value]);
        window.effect = effectList[value];
      }
      loadingSpinner.style.display = "none";
    };

    // Add Screenshot Functionality
    const screenshotButton = document.getElementById("carousel-center-button");

    screenshotButton.addEventListener("click", async () => {
      try {
        const watermarkedCanvas = document.getElementById("watermark-canvas") || null;  // Optional watermark

        // Capture Screenshot
        const newScreenshotCanvas = await takeScreenshot(deepAR, watermarkedCanvas)
        console.log(newScreenshotCanvas)

        const userId = await getUserIdFromSession()
        if (!userId) {
          console.error("user not logged in!");
          return;
        }

        const imgFileBase64 = newScreenshotCanvas.toDataURL("image/jpeg")

        const imgBlob = base64ToBlob(imgFileBase64, "image/jpeg")
        const file = new File([imgBlob], `social-capture-${Date.now()}.jpg`, { type: "image/jpeg" })

        const shareImageContainer = document.querySelector('#share-image-container')
        shareImageContainer.style.backgroundImage = `url(${imgFileBase64})`;

        document.getElementById("share-screen").style.display = "flex";


        await uploadScreenshot(file, userId)

        // Display the Screenshot
        // displayScreenshot(newScreenshotCanvas, "share-image-container");

        // Optionally Pause DeepAR
        deepAR.setPaused(true);

        // Update UI
        // document.getElementById("share-screen").style.display = "flex";
      } catch (error) {
        console.error("Error taking screenshot:", error);
      }
    })

    // Fetch user ID from session
    async function getUserIdFromSession() {
      try {
        const response = await axios.post("/get-user-id");
        return response.data.userId;
      } catch (error) {
        console.error("Error fetching user ID:", error);
        return null;
      }
    }

    async function uploadScreenshot(imageBlob, userId) {
      const formData = new FormData();
      formData.append("image", imageBlob, "profile.png");
      formData.append("userId", userId);

      try {
        const response = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const shareImageContainer = document.querySelector('#share-image-container')
        // shareImageContainer.style.backgroundImage = `url(${response.data.imagePath})`
        console.log("Uploaded Image Path:", response.data.imagePath);
      } catch (error) {
        console.error("Error uploading screenshot:", error);
      }
    }

    const closeShareScreenButton = document.getElementById("close-share-screen");

    closeShareScreenButton.addEventListener("click", () => {
      // Hide the share screen
      const shareImageContainer = document.querySelector('#share-image-container')
      shareImageContainer.style.backgroundImage = ''
      document.getElementById("share-screen").style.display = "none";
      document.querySelector('#downloadPhoto').style.display = "block"

      // Optionally resume DeepAR
      if (typeof deepAR !== "undefined" && deepAR) {
        deepAR.setPaused(false);
      }
    })


  })();

  // const button = document.getElementById('carousel-center-button');

  // setTimeout(() => {
  //   button.style.opacity = "0"
  // }, 20000);  // 300000ms = 5 minutes



  // Download Clicked Image with Frame
  const downloadPhoto = document.getElementById('downloadPhoto');
  const imageFrame = document.getElementById("share-screen");
  var closeShareScreen = document.getElementById("close-share-screen");

  downloadPhoto.addEventListener("click", function () {
    closeShareScreen.style.display = 'none';
    downloadPhoto.style.display = 'none';

    html2canvas(imageFrame).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      var link = document.createElement('a');
      link.href = imgData;
      link.download = "Social_Selfie.png";
      link.click();
      closeShareScreen.style.display = 'flex';
    });
  });


}
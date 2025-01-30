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

    // const effectList = [
    //   "effects/newfilterfiles/WhiteShadesBlueDenimCap.deepar",
    //   "effects/newfilterfiles/DarkBlackQubeGlassesSingle.deepar",
    //   "effects/newfilterfiles/GreenCapSingle.deepar",
    //   "effects/newfilterfiles/RedOnlyCap.deepar",
    //   "effects/newfilterfiles/GoldBrownGlassesSingle.deepar",
    //   "effects/newfilterfiles/CatEyeGlasses.deepar",
    //   "effects/newfilterfiles/BothCap-Glasses.deepar",
    //   "effects/newfilterfiles/whitecaptennis.deepar",
    //   "effects/newfilterfiles/BrownGlassesSingle.deepar",
    //   "effects/newfilterfiles/DenimCapDarkBlackGlasses.deepar",
    //   "effects/newfilterfiles/CloundSkyGlassesSingle.deepar",
    //   "effects/newfilterfiles/BrownShadesRedCap.deepar",
    //   "effects/newfilterfiles/WhiteBigFrameGlassesSingle.deepar",
    //   "effects/newfilterfiles/BlueGlasses.deepar",
    //   "effects/newfilterfiles/RedCapBlackQubeShadesGlasses.deepar",      
    // ];


    let deepAR = null;

    try {
      deepAR = await deepar.initialize({
        licenseKey: "26f99e4a4c4526f420c18a101ef06d89a9aa64214c076cb765adc6ac6ea71985f974515335c431c8",
        previewElement,
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
    const screenshotButton = document.getElementById("carousel-center");

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
        await uploadScreenshot(file, userId)

        // Display the Screenshot
        // displayScreenshot(newScreenshotCanvas, "share-image-container");

        // Optionally Pause DeepAR
        deepAR.setPaused(true);

        // Update UI
        document.getElementById("share-screen").style.display = "flex";
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
        shareImageContainer.style.backgroundImage = `url(${response.data.imagePath})`
        console.log("Uploaded Image Path:", response.data.imagePath);
      } catch (error) {
        console.error("Error uploading screenshot:", error);
      }
    }

    const closeShareScreenButton = document.getElementById("close-share-screen");

    closeShareScreenButton.addEventListener("click", () => {
      // Hide the share screen
      document.getElementById("share-screen").style.display = "none";

      // Optionally resume DeepAR
      if (typeof deepAR !== "undefined" && deepAR) {
        deepAR.setPaused(false);
      }
    })


  })();

  const button = document.getElementById('carousel-center-button');

  setTimeout(() => {
    button.style.opacity = "0"
  }, 20000);  // 300000ms = 5 minutes



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



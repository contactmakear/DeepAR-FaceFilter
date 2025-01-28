export const takeScreenshot = async (deepAR, watermarkCanvas) => {
    if (!deepAR) {
      console.error("DeepAR is not initialized.");
      return;
    }
  
    // Take a screenshot using DeepAR
    const screenshotDataURL = await deepAR.takeScreenshot();
  
    // Load the screenshot as an image
    const screenshotImg = await loadImage(screenshotDataURL);
  
    // Create a new canvas to draw the screenshot and watermark
    const newScreenshotCanvas = document.createElement("canvas");
    const scale = window.devicePixelRatio; // Handle high DPI screens
    newScreenshotCanvas.width = Math.floor(window.innerWidth * scale);
    newScreenshotCanvas.height = Math.floor(window.innerHeight * scale);
  
    const context = newScreenshotCanvas.getContext("2d");
    context.drawImage(
      screenshotImg,
      0,
      0,
      newScreenshotCanvas.width,
      newScreenshotCanvas.height
    );
  
    // Optionally, draw a watermark
    if (watermarkCanvas) {
      context.drawImage(
        watermarkCanvas,
        0,
        0,
        newScreenshotCanvas.width,
        newScreenshotCanvas.height
      );
    }
  
    return newScreenshotCanvas;
  }
  
  export const displayScreenshot = (screenshotCanvas, containerId) => {
    const imageContainer = document.getElementById(containerId);
  
    if (!imageContainer) {
      console.error("Image container not found.");
      return;
    }
  
    // Clear previous content
    while (imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
    }
  
    // Create an image element to display the screenshot
    const img = new Image();
    img.src = screenshotCanvas.toDataURL("image/jpeg");
    // img.style.width = "90%";
    imageContainer.appendChild(img);
  }
  
  // Utility function to load an image
  export const loadImage = async (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossorigin", "anonymous");
      image.crossOrigin = "Anonymous";
      image.src = url;
    })
  
// Convert Base64 to Blob
export const base64ToBlob = (base64, mimeType) => {
  let byteCharacters = atob(base64.split(",")[1]);
  let byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i += 512) {
      let slice = byteCharacters.slice(i, i + 512);
      let byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: mimeType });
}
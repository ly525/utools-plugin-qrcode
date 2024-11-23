import jsQR from "jsqr";
export function jsQRFromBase64(base64) {
  return new Promise((resolve, reject) => {
    const image = document.createElement("img");
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      try {
        const imageData = context.getImageData(0, 0, image.width, image.height); // ImageData

        const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
        resolve(qrCode);
      } catch (e) {
        reject(e);
      }
    };
    image.src = base64;
  });
}


export const showToast = function (text) {
  const toast = document.createElement("div");
  toast.className = "toast-text";
  toast.innerHTML = text;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "1";
  }, 0);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 2000);
};
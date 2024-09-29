import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Device } from '@capacitor/device';

export function usePhotoGallery() {
  const takePhoto = async () => {
    const isMobile = await isMobileDevice();
    if (!isMobile) {
      alert('Taking photos is not supported on pc.');
      return null;
    }
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });
      const file = await createFileFromPhoto(photo);
      return file;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  //   const requestCameraPermission = async () => {
  //     try {
  //       const permission = await navigator.mediaDevices.getUserMedia({ video: true });
  //       if (permission) {
  //         return true;
  //       }
  //     } catch (error) {
  //       console.error('Camera permission denied', error);
  //       return false;
  //     }
  //     return false;
  //   };

  const createFileFromPhoto = async (photo) => {
    const response = await fetch(photo.webPath);
    const blob = await response.blob();
    const fileName = `${new Date().getTime()}.${photo.format}`;
    const file = new File([blob], fileName, { type: `image/${photo.format}` });
    return file;
  };

  const isMobileDevice = async () => {
    const info = await Device.getInfo();
    const isiOS = info.operatingSystem === 'ios';
    const isAndroid = info.operatingSystem === 'android';
    const userAgent = navigator.userAgent.toLowerCase();
    // Additional check for iPad
    const isIpad = isiOS && (info.model.includes('iPad') || info.platform === 'iPadOS' || userAgent.includes('ipad'));
    return isAndroid || isiOS || isIpad;
  };

  return {
    takePhoto,
  };
}

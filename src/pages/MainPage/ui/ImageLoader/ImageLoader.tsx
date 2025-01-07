import { ChangeEvent, useRef } from "react";

import styles from "./ImageLoader.module.scss";
import { getImageCanvas } from "./lib/imageLoader";
import { useShallow } from "zustand/shallow";
import { useImagePageStore } from "../../model/store";

const ImageLoader = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { imageUrl, uniqCount, setPalette, setImageData } = useImagePageStore(
    useShallow((state) => ({
      uniqCount: state.uniqCount,
      imageUrl: state.imageUrl,
      setPalette: state.setPalette,
      setImageData: state.setImageData,
    }))
  );

  const getImagePalette = (event: ChangeEvent<HTMLInputElement>) => {
    if (!canvasRef.current) return;

    getImageCanvas(
      event,
      canvasRef.current,
      setPalette,
      setImageData,
      uniqCount
    );
  };

  return (
    <div className={styles.container}>
      {imageUrl && (
        <div className={styles.imageContainer}>
          <img className={styles.image} src={imageUrl} alt="image preview" />
        </div>
      )}

      <label htmlFor="image" className={styles.imageLabel}>
        Загрузить изображение
        <input
          className={styles.imageInput}
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={getImagePalette}
        />
      </label>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        id="imageCanvas"
      ></canvas>
    </div>
  );
};

export default ImageLoader;

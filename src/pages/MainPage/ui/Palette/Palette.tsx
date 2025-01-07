import { useState } from "react";

import styles from "./Palette.module.scss";
import { useImagePageStore } from "../../model/store";
import ImageModal from "../ImageModal/ImageModal";
import { useShallow } from "zustand/shallow";
import { getImageCanvasFromUrl } from "../ImageLoader/lib/imageLoader";
import { useModalStore } from "@/components/Modal";

const colorCountList = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const colorUniqList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const Palette = () => {
  const [colorCount, setColorCount] = useState<number>(10);

  const {
    imageUrl,
    canvasRef,
    palette,
    uniqCount,
    setUniqCount,
    setPalette,
    setImageData,
  } = useImagePageStore(
    useShallow((state) => ({
      imageUrl: state.imageUrl,
      canvasRef: state.canvasRef,
      palette: state.palette,
      uniqCount: state.uniqCount,
      setUniqCount: state.setUniqCount,
      setPalette: state.setPalette,
      setImageData: state.setImageData,
    }))
  );

  const openModal = useModalStore((state) => state.openModal);

  const uniqSelectHandler = (uniqCount: number) => {
    if (!imageUrl || !canvasRef) return;

    getImageCanvasFromUrl(
      imageUrl,
      canvasRef,
      setPalette,
      setImageData,
      uniqCount
    );
    setUniqCount(uniqCount);
  };

  if (!palette.length) return null;

  return (
    <div className={styles.container}>
      <label htmlFor="colorCountSelect" className={styles.selectorContainer}>
        Выберите количество отображаемых цветов
        <select
          className={styles.selector}
          name="colorCountSelect"
          id="colorCountSelect"
          value={colorCount}
          onChange={(e) => setColorCount(Number(e.target.value))}
        >
          {colorCountList.map((countItem) => (
            <option key={countItem}>{countItem}</option>
          ))}
        </select>
      </label>

      <label htmlFor="colorUniqSelect" className={styles.selectorContainer}>
        Выберите уникальность цвета
        <select
          name="colorUniqSelect"
          id="colorUniqSelect"
          value={uniqCount}
          onChange={(e) => {
            uniqSelectHandler(Number(e.target.value));
          }}
        >
          {colorUniqList.map((colorUniq) => (
            <option key={colorUniq}>{colorUniq}</option>
          ))}
        </select>
      </label>

      <ul className={styles.list}>
        {palette.slice(0, colorCount).map((color, index) => (
          <li
            key={`${index} - ${color}`}
            className={styles.item}
            style={{ "--item-background": color } as { [key: string]: string }}
            onClick={() => openModal(<ImageModal color={color} />)}
          ></li>
        ))}
      </ul>
    </div>
  );
};

export default Palette;

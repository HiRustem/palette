import styles from "./ImageModal.module.scss";
import ImageModalItem from "./ui/ImageModalItem/ImageModalItem";
import { rgbToHex, rgbToHsl } from "../ImageLoader/lib/imageLoader";

interface IImageModal {
  color: string;
}

const ImageModal = ({ color }: IImageModal) => {
  const [r, g, b] = color
    .replace("rgb(", "")
    .replace(")", "")
    .split(",")
    .map(Number);

  const hex = rgbToHex(r, g, b);
  const hsl = rgbToHsl(r, g, b);

  const colorsArray = [
    color,
    hex,
    hsl && `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  ];

  const style: { [key: string]: string } = { "--mini_background": color };

  return (
    <div className={styles.container}>
      <div className={styles.mini} style={style}></div>

      <ul className={styles.list}>
        {colorsArray.map((item) => (
          <li key={item}>
            <ImageModalItem color={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImageModal;

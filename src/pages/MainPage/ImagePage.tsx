import { ImageLoader, Palette } from "./ui";

import styles from "./ImagePage.module.scss";

const ImagePage = () => {
  return (
    <div className={styles.page}>
      <ImageLoader />

      <Palette />
    </div>
  );
};

export default ImagePage;

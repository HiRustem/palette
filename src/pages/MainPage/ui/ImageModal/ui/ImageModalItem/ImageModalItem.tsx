import { useState } from "react";

import styles from "./ImageModalItem.module.scss";
import clsx from "clsx";

interface IImageModalItem {
  color?: string;
}

const ImageModalItem = ({ color }: IImageModalItem) => {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    if (!color) return;

    navigator.clipboard
      .writeText(color)
      .then(() => {
        setIsCopied(true);

        const timeoutId = setTimeout(() => {
          setIsCopied(false);
        }, 1000);

        setTimeoutId(timeoutId);
      })
      .catch((err) => {
        console.error("Ошибка при копировании: ", err);
      })
      .finally(() => {
        timeoutId && clearTimeout(timeoutId);
      });
  };

  const content =
    isHovered && !isCopied
      ? "Скопировать цвет"
      : isCopied
      ? "Цвет скопирован"
      : color;

  if (!color) return null;

  return (
    <button
      className={clsx(styles.button, {
        [styles.hovered]: isHovered,
        [styles.copied]: isCopied,
      })}
      onClick={copyToClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
    </button>
  );
};

export default ImageModalItem;

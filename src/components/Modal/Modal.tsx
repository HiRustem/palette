import { useRef } from "react";
import { useShallow } from "zustand/shallow";

import styles from "./Modal.module.scss";
import clsx from "clsx";
import useModalStore from "./model/store";

const Modal = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { isOpen, closeModal, content } = useModalStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      content: state.content,
      closeModal: state.closeModal,
    }))
  );

  const outsideClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      closeModal();
    }
  };

  return (
    <div
      className={clsx(styles.modal, { [styles.open]: isOpen })}
      onClick={outsideClickHandler}
    >
      <div ref={containerRef} className={styles.container}>
        <div className={styles.header}>
          <button className={styles.close} onClick={closeModal}>
            x
          </button>
        </div>

        {content}
      </div>
    </div>
  );
};

export default Modal;

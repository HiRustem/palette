import { ReactNode } from "react";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type IUseModalStoreState = {
  isOpen: boolean;
  content: ReactNode | null;
};

type IUseModalStoreAction = {
  openModal: (content: ReactNode | null) => void;
  closeModal: () => void;
};

const initialState: IUseModalStoreState = {
  isOpen: false,
  content: null,
};

const useModalStore = create<IUseModalStoreState & IUseModalStoreAction>()(
  immer((set) => ({
    openModal: (content) => {
      document.body.style.overflow = "hidden";

      set({ isOpen: true, content });
    },
    closeModal: () => {
      document.body.style.overflow = "";

      set({ isOpen: false, content: null });
    },
    ...initialState,
  }))
);

export default useModalStore;

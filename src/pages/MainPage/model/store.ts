import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type IUseImagePageStoreState = {
  palette: string[];
  uniqCount: number;
  imageUrl: string | null;
  canvasRef: HTMLCanvasElement | null;
};

type IUseImagePageStoreActions = {
  setImageData: (imageUrl: string, canvasRef: any) => void;
  setUniqCount: (uniqCount: number) => void;
  setPalette: (palette: any) => void;
};

const initialState: IUseImagePageStoreState = {
  palette: [],
  uniqCount: 50,
  imageUrl: null,
  canvasRef: null,
};

export const useImagePageStore = create<
  IUseImagePageStoreState & IUseImagePageStoreActions
>()(
  immer((set) => ({
    setImageData: (imageUrl, canvasRef) => {
      set({ imageUrl, canvasRef });
    },
    setUniqCount: (uniqCount) => {
      set({ uniqCount });
    },
    setPalette: (palette) => {
      set({ palette: palette });
    },
    ...initialState,
  }))
);

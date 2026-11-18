import { createContext, useContext } from "react";

export type SlideCtx = { page: number; total: number; static: boolean };
export const SlideContext = createContext<SlideCtx>({ page: 1, total: 1, static: false });
export const useSlide = () => useContext(SlideContext);

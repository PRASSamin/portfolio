import { create } from "zustand";
import { Toaster as Sonner } from "sonner";

type SonnerProps = React.ComponentProps<typeof Sonner>;

type SonnerOptionsStore = {
  options: SonnerProps;
  setOptions: (newOptions: SonnerProps) => void;
  resetOptions: () => void;
};

export const useSonner = create<SonnerOptionsStore>((set) => ({
  options: {},
  setOptions: (newOptions) => set({ options: newOptions }),
  resetOptions: () => set({ options: {} }), 
}));
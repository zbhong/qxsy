import { create } from 'zustand';

interface ModelStore {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  modelUrl: string | null;
  tilesetFiles: Map<string, File> | null;
  addFiles: (files: File[]) => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setModelUrl: (url: string | null) => void;
  setTilesetFiles: (tilesetFiles: Map<string, File>) => void;
  clearFiles: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  files: [],
  isUploading: false,
  uploadProgress: 0,
  modelUrl: null,
  tilesetFiles: null,
  addFiles: (files: File[]) => set((state) => ({ files: [...state.files, ...files] })),
  setUploading: (uploading: boolean) => set({ isUploading: uploading }),
  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),
  setModelUrl: (url: string | null) => set({ modelUrl: url }),
  setTilesetFiles: (tilesetFiles: Map<string, File>) => set({ tilesetFiles }),
  clearFiles: () => set({ files: [], modelUrl: null, tilesetFiles: null }),
}));

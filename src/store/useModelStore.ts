import { create } from 'zustand';

interface ModelStore {
  files: File[];
  isUploading: boolean;
  uploadProgress: number;
  modelUrl: string | null;
  addFiles: (files: File[]) => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setModelUrl: (url: string | null) => void;
  clearFiles: () => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  files: [],
  isUploading: false,
  uploadProgress: 0,
  modelUrl: null,
  addFiles: (files: File[]) => set((state) => ({ files: [...state.files, ...files] })),
  setUploading: (uploading: boolean) => set({ isUploading: uploading }),
  setUploadProgress: (progress: number) => set({ uploadProgress: progress }),
  setModelUrl: (url: string | null) => set({ modelUrl: url }),
  clearFiles: () => set({ files: [], modelUrl: null }),
}));

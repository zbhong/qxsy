import React, { useRef, useState } from 'react';
import { Upload, FolderOpen, File, X } from 'lucide-react';
import { useModelStore } from '../store/useModelStore';

const UploadArea: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    files,
    isUploading,
    uploadProgress,
    addFiles,
    setUploading,
    setUploadProgress,
    setModelUrl,
    clearFiles,
  } = useModelStore();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const fileArray = Array.from(selectedFiles);
    addFiles(fileArray);
    processFiles(fileArray);
  };

  const processFiles = (fileArray: File[]) => {
    setUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        
        // 查找3D模型文件（.glb或.gltf）
        const modelFile = fileArray.find(file => 
          file.name.endsWith('.glb') || file.name.endsWith('.gltf')
        );
        
        if (modelFile) {
          const modelUrl = URL.createObjectURL(modelFile);
          setModelUrl(modelUrl);
        }
      }
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">上传3D模型</h2>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          {...({ webkitdirectory: true, directory: true } as any)}
        />
        <Upload className="mx-auto h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">拖拽文件夹到此处</h3>
        <p className="text-gray-500 mb-4">或</p>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          选择文件夹
        </button>
      </div>

      {isUploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-600">上传进度: {uploadProgress}%</p>
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-medium text-gray-700 mb-2">已上传文件:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  <File className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => {
                    // 这里可以实现单个文件的删除逻辑
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            onClick={clearFiles}
          >
            清空文件
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadArea;

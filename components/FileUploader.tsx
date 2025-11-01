
import React, { useRef } from 'react';

interface FileUploaderProps {
  label: string;
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  Icon: React.ElementType;
}

const FileUploader: React.FC<FileUploaderProps> = ({ label, accept, multiple = false, onFilesSelected, Icon }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(Array.from(event.target.files));
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-teal-600 border border-gray-600 rounded-lg shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </button>
    </div>
  );
};

export default FileUploader;

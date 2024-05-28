import React, { useState } from 'react';
import { message, Upload, Progress } from 'antd';
import type { GetProp, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const CustomUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (file: FileType) => {
    const reader = new FileReader();
    reader.onloadstart = () => {
      setLoading(true);
      setProgress(0);
    };
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    reader.onloadend = () => setLoading(false);
    reader.onload = (e) => {
      if (e.target) {
        //setLoading(false);
        setProgress(100);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadButton = (
    <div>
      {loading &&  <Progress type="dashboard" percent={progress} /> }

      {!loading && <Progress type="dashboard" percent={progress} /> }
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={(file) => {
         //const valid = beforeUpload(file);
         const valid = true;
          if (valid) {
            handleUpload(file);
          }
          return false; // Prevent default upload behavior
        }}
      >
            <div>UPLOAD</div>
      </Upload>

      {uploadButton}
    </div>
  );
};

export default CustomUpload;

import React from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { upload, partUpload, partMerge, partUploadStart, fileExits, fastUpload } from '../../services/common';
import { fileMD5, SIZE_10M } from '../../utils/file';
const { Dragger } = Upload;

async function partUploadFile (file, md5, data) {
  const { name, type, size } = file;
  const extStart = name.lastIndexOf('.');
  const noExt = extStart < 1;
  const ext = noExt ? "" : name.substr(extStart);
  const fileName = noExt ? name : name.substr(0, extStart);
  // 开始分片上传
  const startResult = await partUploadStart({
    name: fileName,
    ext,
    md5,
    size,
    mime: type,
    ...data
  });
  // 开始标的
  let start = 0;
  if (startResult.type === 2) {
    start = startResult.nextPart;
  }

  const chunks = Math.ceil(size / SIZE_10M);
  for (let currentChunk = start; currentChunk < chunks; currentChunk++) {
    const formdata = new FormData();
    const start = currentChunk * SIZE_10M;
    const end = ((start + SIZE_10M) >= file.size) ? file.size : start + SIZE_10M;
    const filePart = file.slice(start, end);
    formdata.append('filePart', filePart);
    await partUpload({
      md5,
      index: currentChunk,
      _payload: formdata,
    });
  }

  await partMerge({
    md5,
  });
}

async function fastUploadFile (file, md5, data) {
  const { name, type } = file;
  const extStart = name.lastIndexOf('.');
  const noExt = extStart < 1;
  const ext = noExt ? "" : name.substr(extStart);
  const fileName = noExt ? name : name.substr(0, extStart);
  await fastUpload({
    name: fileName,
    mime: type,
    ext,
    md5,
    ...data
  });
}


export default function MyUpload (props) {
  props = {
    name: 'file',
    multiple: true,

    customRequest: async ({ file, onError, onSuccess, onProgress, data }) => {
      try {
        const successCallback = (file) => {
          onSuccess(
            {
              name: file.name,
            },
            file
          );
        }
        const md5 = await fileMD5(file);

        const exitsResult = await fileExits({ md5 });
        // 如果文件存在就快速上传
        if (exitsResult) {
          fastUploadFile(file, md5, data);
          return;
        }

        // 如果文件较小就直接上传
        if (file.size <= SIZE_10M) {
          const formdata = new FormData();
          for (const key in data) {
            formdata.append(key, data[key]);
          }
          formdata.append('file', file);
          upload(formdata).then(() => {
            successCallback(file);
          }).catch(() => onError());
          return;
        }

        await partUploadFile(file, md5, data);
        successCallback(file);
      } catch (err) {
        console.log(err);
        onError();
      }
    },

    data: typeof props.dirId === "number" ? { dirId: props.dirId } : {},

    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      }
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖动文件上传</p>
    </Dragger>
  );
}

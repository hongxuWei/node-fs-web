import React, { useState, useEffect } from 'react';
import { Button, Empty, Checkbox, Modal, Form } from 'antd';
import { getDir, getDirInfo } from '../../services/dir';
import Upload from '../../components/Upload';
import NameModal from '../../components/biz/NameModal';
import DirRedirect from './DirRedirect';
import Item from './Item';
import { handleDelete } from '../../utils/file';
import { getLocalData, setLocalData } from '../../utils/local';
import {
  AppstoreOutlined,
  BarsOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import './index.css';
import { ACTION_RENAME, ACTION_ADD } from '../../constances/actions';

const defaultDirInfo = {
  id: 0,
  fullPathName: '',
  fullParentPathId: '',
  parentId: -1,
}

const NAME_MODAL_HIDE =0;
const NAME_MODAL_ADD_DIR = 1;
const NAME_MODAL_RENAME = 2;
const NAME_MODAL_VISIBLE = [NAME_MODAL_ADD_DIR, NAME_MODAL_RENAME];

export const VIEW_TYPE_SQUARE = 1;
export const VIEW_TYPE_LIST = 2;

function Dir (props) {
  const defaultViewType = getLocalData('dirViewType', VIEW_TYPE_SQUARE);
  const [dir, setDir] = useState([]);
  const [dirInfo, setDirInfo] = useState(defaultDirInfo);
  const [viewType, setViewType] = useState(defaultViewType);
  const [nameModalVisible, setNameModalVisible] = useState(NAME_MODAL_HIDE);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [selectIndexs, setSelectIndexs] = useState([]);

  const [nameForm] = Form.useForm();

  const { dirId } = props.match.params;
  const hasSelected = selectIndexs.length > 0;
  const selectedAll = selectIndexs.length === dir.length && dir.length !== 0;
  const singleSelected = selectIndexs.length === 1;
  const singleSelectedInfo = singleSelected ? dir[selectIndexs[0]] : {};

  const onViewTypeChange = (value) => {
    setLocalData('dirViewType', value);
    setViewType(value);
  }

  const getDirList = () => {
    setUploadVisible(false);
    getDir({ id: dirId }).then((res) => {
      setDir(res);
      setSelectIndexs([]);
    });
  }

  useEffect(() => {
    getDirList();
    if (dirId !== '0') {
      getDirInfo({ dirId }).then((res) => {
        setDirInfo(res);
      })
    } else {
      setDirInfo(defaultDirInfo);
    }
  }, [dirId]);

  const closeNameModal = () => {
    setNameModalVisible(NAME_MODAL_HIDE);
    nameForm.resetFields();
  }

  const onDelete = () => {
    const infoList = selectIndexs.map((v) => ({
      ...dir[v]
    }));
    handleDelete(infoList, getDirList);
  }

  return (
    <div className="dir" key={dirId}>
      <div className="dir-control">
        <div className="dir-control-left">
          {
            (viewType === VIEW_TYPE_LIST && dir.length !== 0) &&
            <Checkbox checked={selectedAll} onChange={(e) => {
              const { checked } = e.target;
              if (checked) {
                const all = new Array(dir.length).fill(0).map((_, i) => i) 
                setSelectIndexs(all);
              } else {
                setSelectIndexs([]);
              }
            }}/>
          }
          <DirRedirect {...dirInfo}/>
        </div>
        <div className="dir-control-right">
          <Button type="primary" className="dir-control-action" size="small" icon={<CloudUploadOutlined />} onClick={() => setUploadVisible(true)}>上传</Button>
          <Button type="primary" className="dir-control-action" size="small" icon={<PlusOutlined />} onClick={() => setNameModalVisible(NAME_MODAL_ADD_DIR)}>新增文件夹</Button>
          { singleSelected && <Button type="primary" className="dir-control-action" ghost size="small" icon={<EditOutlined />} onClick={() => setNameModalVisible(NAME_MODAL_RENAME)}>重命名</Button>}
          { hasSelected && <Button onClick={onDelete} danger type="primary" className="dir-control-action" size="small" icon={<DeleteOutlined />}>删除</Button>}
          <AppstoreOutlined
            onClick={() => onViewTypeChange(VIEW_TYPE_SQUARE)}
            className={`${viewType !== VIEW_TYPE_LIST ? "dir-control-active" : ""} dir-control-action`}/>
          <BarsOutlined
            onClick={() => onViewTypeChange(VIEW_TYPE_LIST)}
            className={`${viewType === VIEW_TYPE_LIST ? "dir-control-active" : ""} dir-control-action`} />
        </div>
      </div>
      <div className={`dir-content ${viewType === VIEW_TYPE_LIST ? 'dir-view-as-list' : ''}`}>
        {
          dir.length === 0 &&
          <Empty style={{ width: '100%' }} image={Empty.PRESENTED_IMAGE_SIMPLE} description='没有任何文件' />
        }
        { dir.map((v, i) => (
            <Item
              {...v}
              viewType={viewType}
              checked={selectIndexs.includes(i)}
              refresh={getDirList}
              changeSelect={(selected) => {
                if (selected) {
                  setSelectIndexs([...selectIndexs, i]);
                } else {
                  const index = selectIndexs.findIndex(index => i === index);
                  selectIndexs.splice(index, 1);
                  setSelectIndexs([...selectIndexs]);
                }
              }}
              key={`${v.id}-${v.type}`}
            />
          ))
        }
      </div>
      <NameModal
        id={dirId}
        visible={NAME_MODAL_VISIBLE.includes(nameModalVisible)}
        onCancel={closeNameModal}
        callback={getDirList}
        mode={nameModalVisible === NAME_MODAL_ADD_DIR ? ACTION_ADD : ACTION_RENAME}
        {...singleSelectedInfo}
      />
      <Modal
        title="上传文件"
        visible={uploadVisible}
        okButtonProps={{ style: { display: "none" }}}
        cancelText="关闭"
        onCancel={() => {
          setUploadVisible(false);
        }}
      >
        <Upload dirId={parseInt(dirId)} onSuccess={getDirList}/>
      </Modal>
    </div>
  );
}

export default Dir;
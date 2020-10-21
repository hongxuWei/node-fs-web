import React, { useState, useEffect } from 'react';
import { Button, Empty, Checkbox, Modal, Input, Form, message } from 'antd';
import { debounce } from 'lodash';
import { getDir, getDirInfo, addDir, batchDeleteDir, renameDir } from '../../services/dir';
import { batchDeleteFile, renameFile } from '../../services/common';
import DirRedirect from './DirRedirect';
import Item from './Item';
import { getLocalData, setLocalData } from '../../utils/local';
import {
  AppstoreOutlined,
  BarsOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import './index.css';

const DIR = 1;

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
  const [selectIndexs, setSelectIndexs] = useState([]);

  const [nameForm] = Form.useForm();

  const { dirId } = props.match.params;
  const hasSelected = selectIndexs.length > 0;
  const selectedAll = selectIndexs.length === dir.length && dir.length !== 0;
  const singleSelected = selectIndexs.length === 1;
  const nameTipIsDir = (singleSelected && dir[selectIndexs[0]].type === DIR)|| nameModalVisible === NAME_MODAL_ADD_DIR;

  const onViewTypeChange = (value) => {
    setLocalData('dirViewType', value);
    setViewType(value);
  }

  const getDirList = () => {
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

  const nameModalOnOk = debounce(async () => {
    let { name } = await nameForm.validateFields()
    name = encodeURIComponent(name);
    // 新增文件夹
    if (nameModalVisible === NAME_MODAL_ADD_DIR) {
      await addDir({ id: dirId, name });
      closeNameModal();
      getDirList();
      message.success('新增成功');
      return;
    }
    const { id } = dir[selectIndexs[0]];
    // 修改文件夹名称
    if (nameTipIsDir) {
      await renameDir({ id, name });
      closeNameModal();
      getDirList();
      message.success('修改文件夹名称成功');
      return;
    }
    // 修改文件名称
    await renameFile({ id, name });
    closeNameModal();
    getDirList();
    message.success('修改文件名称成功');
  }, 300)

  const onDelete = () => {
    Modal.confirm({
      title: "确认删除这些文件吗，如果删除的是文件夹文件夹下面的文件也会一同删除",
      onOk: async () => {
        const dirIds = selectIndexs.filter((v) => dir[v].type === DIR).map((v) => dir[v].id);
        const fileIds = selectIndexs.filter((v) => dir[v].type !== DIR).map((v) => dir[v].id);
        if (dirIds.length > 0) {
          await batchDeleteDir({ ids: dirIds.join(',') });
        }
        if (fileIds.length > 0) {
          await batchDeleteFile({ ids: fileIds.join(',') });
        }
        getDirList();
        message.success('删除成功');
      }
    })
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
      <Modal
        visible={NAME_MODAL_VISIBLE.includes(nameModalVisible)}
        title={nameModalVisible === NAME_MODAL_ADD_DIR ? "新增文件夹" : "重命名"}
        onOk={nameModalOnOk}
        onCancel={closeNameModal}
        destroyOnClose
      >
        <Form
          form={nameForm}
        >
          <Form.Item
            name="name"
            label={`文件${nameTipIsDir ? "夹" : ""}名`}
            rules={[{ required: true, message: `请输入文件${nameTipIsDir ? "夹" : ""}名` }]}
          >
            <Input
              maxLength={nameTipIsDir ? 50 : 100}
              placeholder={
                nameTipIsDir ? "请输入 50 字以内的文件夹名称"
                : "请输入 100 字以内的文件名称"
              }
              autoComplete="off"
              onPressEnter={nameModalOnOk}
              autoFocus
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Dir;
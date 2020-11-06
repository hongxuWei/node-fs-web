import React, { useContext, useEffect, useState } from 'react';
import { Menu, Dropdown, Modal, Form, Input, message } from 'antd';
import { GLOBAL_CONTEXT } from '../../utils/context';
import { getDir, getDirInfo, addDir, batchDeleteDir, renameDir } from '../../services/dir';
import { batchDeleteFile, renameFile } from '../../services/common';
import { TYPE_DIR, TYPE_FILE } from '../../constances/types';
import { ACTION_DELETE, ACTION_PREVIEW, ACTION_MOVE, ACTION_RENAME } from '../../constances/actions';
import useNameModal from '../../components/biz/NameModal';
import './index.css';

function CustomerContextMenu(props) {
  const [visible, setVisible] = useState(false);
  const global = useContext(GLOBAL_CONTEXT);
  const { data = {} } = global;
  const { G_KEY_CUSTOMER_MENUCONTEXT = {} } = data;

  const [NameModal, nameModalAction] = useNameModal({
    ...G_KEY_CUSTOMER_MENUCONTEXT.data,
    callback: G_KEY_CUSTOMER_MENUCONTEXT.refresh,
    mode: "RENAME",
  });

  useEffect(() => {
    if (G_KEY_CUSTOMER_MENUCONTEXT.type === 'dir-list') {
      setVisible(true);
    }
  }, [global])

  const handleDelete = () => {
    const { data, refresh } = G_KEY_CUSTOMER_MENUCONTEXT;
    const title = data.type === TYPE_DIR ? "确认删除该文件夹吗？文件夹下面的文件也会一同删除" : "确认删除该文件吗？";
    Modal.confirm({
      title: "确认删除这些文件吗，如果删除的是文件夹文件夹下面的文件也会一同删除",
      onOk: async () => {
        if (data.type === TYPE_DIR) {
          await batchDeleteDir({ ids: data.id });
        }
        if (data.type === TYPE_FILE) {
          await batchDeleteFile({ ids: data.id });
        }
        refresh();
        message.success('删除成功');
      }
    });
  }

  const handleRename = () => {
    nameModalAction.show();
  }

  const menu = (
    <Menu onClick={({ key }) => {
      setVisible(false);
      if (key === ACTION_DELETE) {
        handleDelete();
      }

      if(key === ACTION_RENAME) {
        handleRename();
      }
    }}>
      <Menu.Item key={ACTION_RENAME}>重命名</Menu.Item>
      <Menu.Item key={ACTION_PREVIEW}>预览</Menu.Item>
      <Menu.Item key={ACTION_DELETE}>删除</Menu.Item>
      <Menu.Item key={ACTION_MOVE}>移动</Menu.Item>
    </Menu>
  );
    console.log(NameModal)
  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      onVisibleChange={(visible) => {
        if (!visible) setVisible(false);
      }}
      visible={visible}
    >
      <div className="customer-context-menu"
        style={{
          left: G_KEY_CUSTOMER_MENUCONTEXT.clientX,
          top: G_KEY_CUSTOMER_MENUCONTEXT.clientY,
        }}
      >
        {NameModal}
      </div>
    </Dropdown>
  );
}

export default CustomerContextMenu;
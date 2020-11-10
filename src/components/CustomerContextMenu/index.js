import React, { useContext, useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { GLOBAL_CONTEXT } from '../../utils/context';
import { ACTION_DELETE, ACTION_PREVIEW, ACTION_MOVE, ACTION_RENAME } from '../../constances/actions';
import NameModal from '../../components/biz/NameModal';
import { handleDelete } from '../../utils/file';
import './index.css';

function CustomerContextMenu(props) {
  const [visible, setVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const global = useContext(GLOBAL_CONTEXT);
  const { data = {} } = global;
  const { G_KEY_CUSTOMER_MENUCONTEXT = {} } = data;

  useEffect(() => {
    if (G_KEY_CUSTOMER_MENUCONTEXT.type === 'dir-list') {
      setVisible(true);
    }
  }, [global])

  const onDelete = () => {
    const { data, refresh } = G_KEY_CUSTOMER_MENUCONTEXT;
    handleDelete([data], refresh);
  }

  const menu = (
    <Menu onClick={({ key }) => {
      setVisible(false);
      if (key === ACTION_DELETE) {
        onDelete();
      }

      if(key === ACTION_RENAME) {
        setNameModalVisible(true);
      }
    }}>
      <Menu.Item key={ACTION_RENAME}>重命名</Menu.Item>
      <Menu.Item key={ACTION_PREVIEW}>预览</Menu.Item>
      <Menu.Item key={ACTION_DELETE}>删除</Menu.Item>
    </Menu>
  );
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
        <NameModal
          {...G_KEY_CUSTOMER_MENUCONTEXT.data}
          visible={nameModalVisible}
          onCancel={() => setNameModalVisible(false)}
          callback={G_KEY_CUSTOMER_MENUCONTEXT.refresh}
          mode={ACTION_RENAME}
        />
      </div>
    </Dropdown>
  );
}

export default CustomerContextMenu;

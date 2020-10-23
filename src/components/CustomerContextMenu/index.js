import React, { useContext, useEffect, useState } from 'react';
import { Menu, Dropdown } from 'antd';
import { GLOBAL_CONTEXT } from '../../utils/context';
import './index.css';

function CustomerContextMenu(props) {
  const [visible, setVisible] = useState(false);
  const global = useContext(GLOBAL_CONTEXT);
  const { data = {} } = global;
  const { G_KEY_CUSTOMER_MENUCONTEXT = {} } = data;

  useEffect(() => {
    if (G_KEY_CUSTOMER_MENUCONTEXT.type === 'dir-list') {
      setVisible(true);
    }
  }, [global])

  console.log(G_KEY_CUSTOMER_MENUCONTEXT)

  const menu = (
    <Menu onClick={(v) => {
      setVisible(false);
    }}>
      <Menu.Item key='preview'>预览</Menu.Item>
      <Menu.Item key='delete'>删除</Menu.Item>
      <Menu.Item key='move'>移动</Menu.Item>
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
      </div>
    </Dropdown>
  );
}

export default CustomerContextMenu;
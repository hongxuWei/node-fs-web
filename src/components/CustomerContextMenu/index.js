import React from 'react';
import { Menu, Dropdown } from 'antd';

function CustomerContextMenu(props) {
  const menu = (
    <Menu onClick={this.handleMenuClick}>
      <Menu.Item key="1">Clicking me will not close the menu.</Menu.Item>
      <Menu.Item key="2">Clicking me will not close the menu also.</Menu.Item>
      <Menu.Item key="3">Clicking me will close the menu.</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown
      overlay={menu}
      onVisibleChange={this.handleVisibleChange}
      visible={this.state.visible}
    >
      <div className="customer-context-menu">
      </div>
    </Dropdown>
  );
}

export default CustomerContextMenu;
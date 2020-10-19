import React from "react";
import { Layout, Menu } from "antd";
import { useLocation, useHistory } from "react-router-dom";

import {
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const menu = [
  { name: '1', path: "/", icon: <UserOutlined /> },
  { name: '全部文件', path: "/dir/0", icon: <FileTextOutlined /> },
  { name: '3', path: "/about", icon: <UserOutlined /> },
];

export default function MySider() {
  const location = useLocation();
  const history = useHistory();
  const { pathname } = location;
  const m = menu.find((i) => i.path === pathname);
  const selectedKeys = [];
  if (m) {
    selectedKeys.push(m.name);
  }
  return (
    <Layout.Sider>
      <Menu selectedKeys={selectedKeys} theme="dark" mode="inline">
        {menu.map((i) => (
          <Menu.Item key={i.name} icon={i.icon} onClick={() => history.push(i.path)}>
            {i.name}
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  );
}

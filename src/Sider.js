import React from "react";
import { Layout, Menu } from "antd";
import { useLocation, useHistory } from "react-router-dom";

import {
  FileTextOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const menu = [
  { name: '全部文件', path: "/dir/0", icon: <FileTextOutlined /> },
  { name: '回收站', path: "/trash/0", icon: <DeleteOutlined /> },
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
    <Layout.Sider collapsed>
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

import React, { useState } from 'react';
import { Modal, Form, Input, message } from "antd";
import { debounce } from 'lodash';
import { ACTION_ADD, ACTION_RENAME } from '../../../constances/actions';
import { TYPE_DIR } from '../../../constances/types';
import { addDir, renameDir } from '../../../services/dir';
import { renameFile } from '../../../services/common';

function useNameModal(props) {
  const { type, id, name = '', mode, visible = false, callback } = props;
  const [modalVisible, setModalVisible] = useState(visible);
  const [nameForm] = Form.useForm();

  const actions = {
    show: () => setModalVisible(true),
    hide: () => {
      setModalVisible(false);
      nameForm.resetFields();
    },
  };

  const isDir = type === TYPE_DIR;
  const nameModalOnOk = debounce(async () => {
    let { name } = await nameForm.validateFields()
    // 新增文件夹
    if (isDir && mode === ACTION_ADD) {
      await addDir({ id, name });
      actions.hide();
      callback();
      message.success('新增成功');
      return;
    }
    name = encodeURIComponent(name);
    // 修改文件夹名称
    if (isDir) {
      await renameDir({ id, name });
      actions.hide();
      callback();
      message.success('修改文件夹名称成功');
      return;
    }
    // 修改文件名称
    await renameFile({ id, name });
    actions.hide();
    callback();
    message.success('修改文件名称成功');
  }, 300)

  const modal = (
    <Modal
      visible={modalVisible}
      title={mode === ACTION_RENAME ? "重命名" : "新增文件夹"}
      onOk={nameModalOnOk}
      onCancel={actions.hide}
      destroyOnClose
    >
      <Form
        form={nameForm}
        initialValues={{ name }}
      >
        <Form.Item
          name="name"
          label={`文件${isDir ? "夹" : ""}名`}
          rules={[{ required: true, message: `请输入文件${isDir ? "夹" : ""}名` }]}
        >
          <Input
            maxLength={isDir ? 50 : 100}
            placeholder={
              isDir ? "请输入 50 字以内的文件夹名称"
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
  );
  return [modal, { ...actions }];
}

export default useNameModal;
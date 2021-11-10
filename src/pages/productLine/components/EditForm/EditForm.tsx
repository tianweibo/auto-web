import React, { FC, useEffect, useState } from 'react';
import {
  addProductLine,
  editproductLine,
  detailproductLine,
} from '../../service';
import { Table, Drawer, Form, Button, Input, Select, message } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import './style.less';

const EditForm: FC<any> = (props) => {
  const [form] = Form.useForm();
  const { drawerConf, onCancelEdit, createList, editList } = props;

  //处理完成操作
  const handleFinished = async (values: any) => {
    var temp = JSON.parse(JSON.stringify(values));
    var res: any = {};
    if (drawerConf.title == '编辑产品线') {
      res = await editproductLine(temp, drawerConf.data.id);
      if (res?.status == 0) {
        message.success(res.msg || '编辑成功');
        onCancelEdit();
        editList();
      }
    } else {
      res = await addProductLine(temp);
      if (res?.status == 0) {
        message.success(res.msg || '创建成功');
        onCancelEdit();
        createList();
      }
    }
  };
  const onFormLayoutChange = (e: any) => {};
  const saveData = async () => {
    if (!form) return;
    form.submit();
  };
  const getProductDetail = async (id: string) => {
    var res: any = {};
    res = await detailproductLine(id);
    form.setFieldsValue(res.data);
  };
  useEffect(() => {
    if (drawerConf.data) {
      getProductDetail(drawerConf.data.id);
    }
  }, []);
  return (
    <Drawer
      title={drawerConf.title}
      placement="right"
      onClose={onCancelEdit}
      visible={drawerConf.visible}
      bodyStyle={{ paddingBottom: 80 }}
      width={'80%'}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onCancelEdit} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" onClick={saveData}>
            保存
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        initialValues={{ product_use: 1 }}
        onValuesChange={onFormLayoutChange}
        onFinish={handleFinished}
      >
        <Form.Item
          label="产品线名称"
          name="productname"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input maxLength={15} disabled={drawerConf.data != undefined} />
        </Form.Item>

        <Form.Item name="product_use" label="是否启用">
          <Select placeholder="请选择角色">
            <Option value={0}>停用</Option>
            <Option value={1}>启用</Option>
          </Select>
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea placeholder="请输入" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditForm;

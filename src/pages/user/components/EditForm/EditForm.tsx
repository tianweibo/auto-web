import React, { FC, useEffect, useState } from 'react';
import { addUser, editUser, detailUser, requireProList } from '../../service';
import { Table, Drawer, Form, Button, Input, Select, message } from 'antd';
const { Option } = Select;
const { TextArea } = Input;
import './style.less';

const EditForm: FC<any> = (props) => {
  const [form] = Form.useForm();
  const [productList, setProductList] = useState<
    Array<{ label: string; value: number }>
  >([]);
  const { drawerConf, onCancelEdit, createList, editList } = props;

  //处理完成操作
  const handleFinished = async (values: any) => {
    var temp = JSON.parse(JSON.stringify(values));
    temp['product_line_name'] = form.getFieldValue('product_line_name');
    var res: any = {};
    if (drawerConf.title == '编辑用户') {
      res = await editUser(temp, drawerConf.data.id);
      if (res?.status == 0) {
        message.success(res.msg || '编辑成功');
        onCancelEdit();
        editList();
      }
    } else {
      res = await addUser(temp);
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
  const getUserDetail = async (id: string) => {
    var res: any = {};
    res = await detailUser(id);
    form.setFieldsValue(res.data);
  };
  const getProList = async () => {
    var res: any = {};
    res = await requireProList();
    setProductList(res.data);
    //form.setFieldsValue(res.data);
  };
  const choiceProduct = (val: any) => {
    var name = '';
    for (let i = 0; i < productList.length; i++) {
      if (val === productList[i].value) {
        name = productList[i].label;
      }
    }
    form.setFieldsValue({ product_line_name: name });
  };
  useEffect(() => {
    getProList();
    if (drawerConf.data) {
      getUserDetail(drawerConf.data.id);
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
        initialValues={{ role: 1 }}
        onValuesChange={onFormLayoutChange}
        onFinish={handleFinished}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input maxLength={15} disabled={drawerConf.data != undefined} />
        </Form.Item>
        <Form.Item
          label="真实名"
          name="realname"
          rules={[{ required: true, message: '请输入真实名' }]}
        >
          <Input maxLength={15} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="手机号"
          rules={[
            { required: true },
            {
              pattern: /^[+]{0,1}(\d){1,3}[ ]?([-]?((\d)|[ ]){1,12})+$/,
              message: '输入正确的手机号',
            },
          ]}
        >
          <Input placeholder="请输入手机号" maxLength={15} />
        </Form.Item>
        <Form.Item name="role" label="角色">
          <Select placeholder="请选择角色">
            <Option value={10}>管理员</Option>
            <Option value={1}>普通用户</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="product_line_id"
          label="所属产品线"
          rules={[{ required: true, message: '请选择产品线' }]}
        >
          <Select
            placeholder="请选择产品线"
            onChange={choiceProduct}
            options={productList}
          ></Select>
        </Form.Item>
        <Form.Item name="remark" label="备注">
          <TextArea placeholder="请输入" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default EditForm;

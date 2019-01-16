import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  Switch,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import TreeSeltctInput from '@/components/TreeSeltctInput'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './AdminManager.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing'];
const status = ['停用', '正常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, onChangeTreeSelect, handleChange, deptData, roleData, statusValue} = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  //处理角色数据
  const roleValues = [];
  if(roleData){
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={roleData[i].roleId}>{roleData[i].roleName}</Option>);
    }
  }

  //处理部门数据
  function child(data){
      for(let i =0; i < data.length; i++){
        data[i].value = data[i].deptId;
        data[i].key = data[i].deptId;
        data[i].title = data[i].name;
        if(data[i].children){
          data[i].children = child(data[i].children);
        }
      }
      return data;
  }
  return (
    <Modal
      destroyOnClose
      title="新增管理员"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名">
        {form.getFieldDecorator('username', {
          rules: [{ required: true, message: '请输入至少2个字符的用户名！', min: 2 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="密&emsp;码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入至少8个字符的用户名！', min: 8 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="邮&emsp;箱">
        {form.getFieldDecorator('email', {
          rules: [{ required: true, message: '请输入至少两个字符的邮箱！', min: 2 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="手&emsp;机">
        {form.getFieldDecorator('mobile', {
          rules: [{ required: true, message: '请输入至少两个字符的手机！', min: 2 }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属部门">
        {form.getFieldDecorator('deptId', {
          rules: [{ required: true, message: '请选择所属部门！' }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={child(deptData)}
            dropdownMatchSelectWidth={false}
            treeDefaultExpandAll={false}
            placeholder="请选择部门"
            onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角&emsp;色">
        {form.getFieldDecorator('roleIdList', {
          rules: [{ required: false}],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择角色"
            onChange={handleChange}
          >
            {roleValues}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状&emsp;态">
        {form.getFieldDecorator('status', {
          rules: [{ required: false}],
          initialValue: statusValue,
        })(
            <RadioGroup>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>停用</Radio>
            </RadioGroup>
        )}
      </FormItem>
    </Modal>
  );
});

@Form.create()
class UpdateForm extends PureComponent {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    console.log(props,"((((((((((((((");

    this.state = {
      formVals: {
        name: props.values.username,
        key: props.values.userId,
        deptId: props.values.deptId,
        deptName: props.values.deptName,
        email: props.values.email,
        mobile: props.values.mobile,
        roleIdList: null,
        salt: "YzcmCZNvbXocrsz9dm8e",
        status: props.values.status,
        userId: props.values.userId,
        username: props.values.username,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }






  renderContent = (formVals, roleValues, deptData) => {
    const { form } = this.props;
    console.log(formVals, roleValues, deptData," ^&&&&&&&&&&&&&&&&&&&^%%");
      return [
        //编辑
        <FormItem {...this.formLayout} label="用户名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入至少2个字符的用户名 ！', min: 2 }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入"/>)}
        </FormItem>,
        <FormItem {...this.formLayout} label="密&emsp;码">
          {form.getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入至少8个字符的用户名！', min: 8 }],
          })(<Input placeholder="请输入" />)}
        </FormItem>,
        <FormItem {...this.formLayout} label="邮&emsp;箱">
          {form.getFieldDecorator('email', {
            rules: [{ required: true, message: '请输入至少两个字符的邮箱！', min: 2 }],
            initialValue: formVals.email,
          })(<Input placeholder="请输入"/>)}
        </FormItem>,
        <FormItem {...this.formLayout} label="手&emsp;机">
          {form.getFieldDecorator('mobile', {
            rules: [{ required: true, message: '请输入至少两个字符的手机！', min: 2 }],
            initialValue: formVals.mobile,
          })(<Input placeholder="请输入"/>)}
        </FormItem>,
        <FormItem {...this.formLayout} label="所属部门">
          {form.getFieldDecorator('deptId', {
            rules: [{ required: true, message: '请选择所属部门！' }],
            initialValue: formVals.deptId,
          })(
            <TreeSelect
              className={styles.width}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={deptData}
              dropdownMatchSelectWidth={false}
              treeDefaultExpandAll={false}
              placeholder="请选择部门"
              // onChange={onChangeTreeSelect}
            />
          )}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角&emsp;色">
            {form.getFieldDecorator('roleIdList', {
                rules: [{ required: false}],
                initialValue: formVals.roleIdList,
              })(
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择角色"
                  // defaultValue={formVals.roleIdList}
                  // onChange={handleChange}
                >
                  {roleValues}
                </Select>
              )}
        </FormItem>,
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状&emsp;态">
          {form.getFieldDecorator('status', {
            rules: [{ required: false}],
            initialValue: formVals.status,
          })(
            <RadioGroup>
              <Radio value={1}>正常</Radio>
              <Radio value={0}>停用</Radio>
            </RadioGroup>
          )}
        </FormItem>
      ];
  };



  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, roleData, deptData} = this.props;
    const { formVals } = this.state;
    //处理角色数据
    const roleValues = [];
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={roleData[i].roleId}>{roleData[i].roleName}</Option>);
    }
    //处理部门数据
    function child(data){
      for(let i =0; i < data.length; i++){
        data[i].value = data[i].deptId;
        data[i].key = data[i].deptId;
        data[i].title = data[i].name;
        if(data[i].children){
          data[i].children = child(data[i].children);
        }
      }
      return data;
    }
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新管理员"
        width={940}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {this.renderContent( formVals, roleValues, child(deptData))}
      </Modal>
    );
  }

}

/* eslint react/no-multi-comp:0 */
@connect(({ usr,dept, role, loading}) => ({
  usr,
  dept,
  role,
  loading: loading.effects["usr/fetch","dept/fetch","role/fetch"],
}))
@Form.create()
class AdminManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: "userId",  //列表的唯一键
    statusValue: 1, //状态默认选中正常 0正常 1停用
    roleData:[], //角色下拉菜单数据
    deptData:[]  //部门树菜单数据
  }

  columns = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        }
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>修改</a>
          <Divider type="vertical" />
          <a onClick={() => this.deleted(record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/fetch',
    });
    dispatch({
      type: 'dept/fetch',
    });
    dispatch({
      type: 'role/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'usr/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'usr/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'usr/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };
  onChangeTreeSelect = (value) => {
    console.log(value);
  }
  handleChange = (value) =>{
    console.log(value);
  }
  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'usr/fetch',
        payload: values,
      });
    });
  };
  //新建用户
  handleModalVisible = (flag) => {

    console.log(this.props,66666666666)
    const {
      dept,
      role
    } = this.props

    this.setState({
      modalVisible: !!flag,
      roleData:role.data.list,
      deptData:dept.data.list,
    });
  };
  handleAdd = fields => {
    console.log(fields,777777777);
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/add',
      payload: fields,
    });

    message.success('添加成功');
    this.handleModalVisible();
  };
  //修改用户信息
  handleUpdateModalVisible = (flag, record) => {
    const {
      dept,
      role
    } = this.props
    console.log(record,flag,"修改用户信息——————————————————————")
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
      roleData:role.data.list,
      deptData:dept.data.list,
    });
  };
  //删除单个用户信息
  deleted = (record) =>{
    const userid = record.userId;
    console.log(userid,"userid+)))))))))))))))))))))))))))))",[userid]);
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/remove',
      payload:[userid]
    });
  }


  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      usr: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onChangeTreeSelect:this.onChangeTreeSelect,
      handleChange:this.handleChange,
      roleData:this.state.roleData,
      deptData:this.state.deptData,
      statusValue:this.state.statusValue
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      roleData:this.state.roleData,
      deptData:this.state.deptData,
    };
    console.log(data,"表格数据");
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey = {this.state.key}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default AdminManager;

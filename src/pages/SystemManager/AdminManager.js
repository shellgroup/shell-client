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
  Radio, TreeSelect,
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
  const { modalVisible, form, handleAdd, handleModalVisible, onChangeTreeSelect, handleChange} = props;
  console.log(props,8888);
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const Option = Select.Option;

  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  }


  const treeData = [{
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [{
      title: 'Child Node1',
      value: '0-0-1',
      key: '0-0-1',
    }, {
      title: 'Child Node2',
      value: '0-0-2',
      key: '0-0-2',
    }],
  }, {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
  }];
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
        {form.getFieldDecorator('name', {
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
        {form.getFieldDecorator('dept', {
          rules: [{ required: true, message: '请选择所属部门！', min: 2 }],
        })(
          <TreeSelect
            className={styles.width}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData}
            dropdownMatchSelectWidth={false}
            placeholder="请选择部门"
            treeDefaultExpandAll
            onChange={onChangeTreeSelect}
          />
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角&emsp;色">
        {form.getFieldDecorator('role', {
          rules: [{ required: false}],
        })(
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择角色"
            onChange={handleChange}
          >
            {children}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状&emsp;态">
        {form.getFieldDecorator('status', {
          rules: [{ required: false}],
        })(
          <div>
            <RadioGroup defaultValue={1}>
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
            </RadioGroup>
          </div>
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






  renderContent = (formVals) => {
    const { form } = this.props;
      return [
        //编辑
        <FormItem {...this.formLayout} label="用户名">
          {form.getFieldDecorator('name', {
            rules: [{ required: true, message: '请输入至少2个字符的用户名 ！', min: 8 }],
            initialValue: formVals.name,
          })(<Input placeholder="请输入"/>)}
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

        <FormItem {...this.formLayout} label="状&emsp;态">
            {form.getFieldDecorator('status', {
                rules: [{ required: false}]
              })(
                <div>
                  <RadioGroup defaultValue={formVals.status}>
                    <Radio value={1}>A</Radio>
                    <Radio value={2}>B</Radio>
                  </RadioGroup>
                </div>
              )}
        </FormItem>




      ];
  };



  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;

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
        {this.renderContent( formVals)}
      </Modal>
    );
  }

}

/* eslint react/no-multi-comp:0 */
@connect(({ usr, loading }) => ({
  usr,
  loading: loading.models.usr,
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
    key: "userId",
    val: undefined,
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
          <a href="">删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/fetch',
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

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    console.log(record,flag,"****************")
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    console.log(fields,777777777);
    const { dispatch } = this.props;
    dispatch({
      type: 'usr/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

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
      handleChange:this.handleChange
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
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

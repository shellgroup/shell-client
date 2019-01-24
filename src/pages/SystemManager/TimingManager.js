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
  message,
  Badge,
  Divider,
  Steps,
  Radio, TreeSelect,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TimingManager.less';
import { tips, disablesBtns, showDeleteConfirmParames, child } from '../../utils/utils';
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['processing', 'default'];
const status = ['正常', '停用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      destroyOnClose
      title="新增定时任务"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="BEAN名称">
        {form.getFieldDecorator('beanName', {
          rules: [{ required: false, message: '请输入BEAN名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="方法名称">
        {form.getFieldDecorator('methodName', {
          rules: [{ required: false, message: '请输入方法名称！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参&emsp;数">
        {form.getFieldDecorator('params', {
          rules: [{ required: false, message: '请输入参数！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="CRON表达式">
        {form.getFieldDecorator('cronExpression', {
          rules: [{ required: false, message: '请输入CRON表达式！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备&emsp;注">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '请输入备注！'}],
        })(<Input placeholder="请输入" />)}
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
    this.state = {
      formVals: {
        beanName: props.values.beanName,
        createTime: props.values.createTime,
        cronExpression: props.values.cronExpression,
        jobId: props.values.jobId,
        methodName: props.values.methodName,
        params: props.values.params,
        remark: props.values.remark,
        status: props.values.status,
      },
      currentStep: 0,
      confirmDirty: false,
    };

    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
  }

  render() {
    const {
      updateModalVisible,
      handleUpdateModalVisible,
      handleUpdate,
    } = this.props;
    const { formVals } = this.state;
    const { form } = this.props;

    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleUpdate(fieldsValue);
      });
    };

    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新定时任务"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('jobId', {
          rules: [{ required: false }],
          initialValue: formVals.jobId,
        })(<Input type={'hidden'} />)}
        {form.getFieldDecorator('createTime', {
          rules: [{ required: false }],
          initialValue: formVals.createTime,
        })(<Input type={'hidden'} />)}
        {form.getFieldDecorator('status', {
          rules: [{ required: false }],
          initialValue: formVals.status,
        })(<Input type={'hidden'} />)}
        <FormItem {...this.formLayout} label="BEAN名称">
          {form.getFieldDecorator('beanName', {
            rules: [{ required: false, message: '请输入BEAN名称！'}],
            initialValue: formVals.beanName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="方法名称">
          {form.getFieldDecorator('methodName', {
            rules: [{ required: false, message: '请输入方法名称！'}],
            initialValue: formVals.methodName,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="参&emsp;数">
          {form.getFieldDecorator('params', {
            rules: [{ required: false, message: '请输入参数！'}],
            initialValue: formVals.params,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="CRON表达式">
          {form.getFieldDecorator('cronExpression', {
            rules: [{ required: false, message: '请输入CRON表达式！'}],
            initialValue: formVals.cronExpression,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="备&emsp;注">
          {form.getFieldDecorator('remark', {
            rules: [{ required: false, message: '请输入备注！'}],
            initialValue: formVals.remark,
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ timing, loading }) => ({
  timing,
  loading: loading.models.timing,
}))
@Form.create()
class TimingManager extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'jobId',
  };

  columns = [
    {
      title: 'BEAN名称',
      dataIndex: 'beanName',
    },
    {
      title: '参数',
      dataIndex: 'params',
    },
    {
      title: 'CRON表达式',
      dataIndex: 'cronExpression',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <Button type={'primary'} onClick={() => this.handleUpdateModalVisible(true, record)}>修改</Button>
          <Divider type="vertical" />
          <Button type={'primary'} onClick={() => this.showDeleteConfirm(1,record)}>暂停</Button>
          <Divider type="vertical" />
          <Button type={'primary'} onClick={() => this.showDeleteConfirm(2,record)}>恢复</Button>
          <Divider type="vertical" />
          <Button type={'primary'} onClick={() => this.showDeleteConfirm(3,record)}>执行</Button>
          <Divider type="vertical" />
          <Button type={'primary'} onClick={() => this.showDeleteConfirm(4,record)}>删除</Button>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'timing/fetch',
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
      type: 'timing/fetch',
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
      type: 'timing/fetch',
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
          type: 'timing/remove',
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
        type: 'timing/fetch',
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
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    console.log(fields, '__________添加用户的参数');
    const { dispatch, usr } = this.props;
    dispatch({
      type: 'timing/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'timing/fetch');
      },
    });

    //message.success('添加成功');
    this.handleModalVisible();
  };

  //删除&恢复&暂停&执行定时任务 1暂停 2恢复 3执行 4删除
  showDeleteConfirm = (index, record) => {
    let that = this;
    const showDeleteTipsParames = showDeleteConfirmParames(index);
    confirm({
      ...showDeleteTipsParames,
      onOk() {
         that.deleted(index, record);
      },
      onCancel() {
        console.log('取消操作');
      },
    });
  };
  deleted = (index, record) => {
    const { dispatch } = this.props;
    let path = "timing/remove";
    if(index == 1){
      path = "timing/suspend";
    }else if(index == 2){
      path = "timing/recovery";
    }else if(index == 3){
      path = "timing/implement";
    }
    dispatch({
      type: path,
      payload: [record.jobId],
      callback: res => {
        tips(res, this, 'timing/fetch');
      },
    });
  };
  //批量删除
  showDeletesConfirm = () => {
    console.log(showDeleteConfirmParames);
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.handleMenuClick();
      },
      onCancel() {
        console.log('取消删除');
        that.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timing/update',
      payload: fields,
      callback: (res) => {
        tips(res, this, 'timing/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });
    //message.success('配置成功');
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
            <FormItem label="BEAN名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
                日志列表
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
            <FormItem label="BEAN名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" htmlType="submit">
              日志列表
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
      timing: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">暂停</Menu.Item>
        <Menu.Item key="remove">恢复</Menu.Item>
        <Menu.Item key="approval">执行</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
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
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              rowKey={this.state.key}
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

export default TimingManager;

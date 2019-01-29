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
import StandardTableNoCheckBox from '@/components/StandardTableNoCheckBox';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TimingManager.less';
import { tips, disablesBtns, showDeleteConfirmParames, child } from '../../utils/utils';
const { MonthPicker, RangePicker } = DatePicker;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';
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
const statusLog = ['成功', '失败'];

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

@connect(({ timingLog, loading }) => ({
  timingLog,
  loading: loading.models.timingLog,
}))
@Form.create()
class LogListForm extends PureComponent {
  static defaultProps = {
    handleLogListModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    console.log(props,66666777888);
    this.state = {
      currentStep: 0,
      confirmDirty: false,
      formValues: {},
      key:"logId"
    };

    let { dispatch } = this.props;
    dispatch({
      type: 'timingLog/fetch',
    });
  }
  columns = [
    {
      title: '日志ID',
      dataIndex: 'logId',
    },
    {
      title: '任务ID',
      dataIndex: 'jobId',
    },
    {
      title: 'BEAN名称',
      dataIndex: 'beanName',
    },
    {
      title: '方法名称',
      dataIndex: 'methodName',
    },
    {
      title: '参数',
      dataIndex: 'params',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: statusLog[0],
          value: 0,
        },
        {
          text: statusLog[1],
          value: 1,
        },
      ],
      render(val) {
        return <Badge status={statusMap[val]} text={statusLog[val]} />;
      },
    },
    {
      title: '耗时(单位：毫秒)',
      dataIndex: 'times',
    },
    {
      title: '执行时间',
      dataIndex: 'createTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '异常日志',
      render: record => ((<Button type={'primary'} onClick={() => this.showConfirm(record)}>查看</Button>)),
    }

  ];
  handleTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'timingLog/fetch',
      payload: params,
    });
  };
  render() {
    const {
      logListModalVisible,
      handleLogListModalVisible,
      timingLog: { data },
      loading
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
console.log(this.props,77889900);
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="日志列表"
        width={1400}
        visible={logListModalVisible}
        onCancel={() => handleLogListModalVisible(false)}
        footer={null}
      >
        <Form onSubmit={this.handleSearch} layout="inline" className={styles.submitselect}>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={7} sm={12}>
              <FormItem label="BEAN名称">
                {getFieldDecorator('name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={7} sm={12}>
              <FormItem label="方法名称">
                {getFieldDecorator('name')(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col md={9} sm={12}>
              <FormItem label="执行时间">
                {getFieldDecorator('name')(
                  <RangePicker
                    format={dateFormat}
                    showTime={{
                      defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                    }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <div className={styles.selectBox}>
            <Col md={2} sm={12}>
            <span >
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
            </Col>
            <Col md={2} sm={12}>
            <span >
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
            </Col>
          </div>
        </Form>
        <StandardTableNoCheckBox
          //selectedRows={selectedRows}
          loading={loading}
          data={data}
          rowKey={this.state.key}
          columns={this.columns}
          //onSelectRow={this.handleSelectRows}
          onChange={this.handleTableChange}
        />
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
    logListModalVisible:false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'jobId',
    DeleteBtn: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
    PauseBtn: false,
    ResumeBtn: false,
    RunBtn: false,
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
      title: '方法',
      dataIndex: 'methodName',
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

    disablesBtns(this);
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
    let showDeleteTipsParames = null;
    let path = "";
    if(e.key == "suspend"){
      path = "timing/suspend";
      showDeleteTipsParames = showDeleteConfirmParames(1);
    }else if(e.key == "recovery"){
      path = "timing/recovery";
      showDeleteTipsParames = showDeleteConfirmParames(2);
    }else if(e.key == "implement"){
      path = "timing/implement";
      showDeleteTipsParames = showDeleteConfirmParames(3);
    }else{
      path = "timing/remove";
      showDeleteTipsParames = showDeleteConfirmParames(4);
    }
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        dispatch({
          type: path,
          payload: selectedRows.map(row => row.jobId),
          callback: res => {
            tips(res, that, 'timing/fetch');
            that.setState({
              selectedRows: [],
            });
          },
        });
      },
      onCancel() {
        console.log('取消操作');
        that.setState({
          selectedRows: [],
        });
      },
    });
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
  handleLogListModalVisible = flag => {
    this.setState({
      logListModalVisible: !!flag,
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
            <FormItem label="方法名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleLogListModalVisible(true)}>
                日志列表
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
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
          <Col md={8} sm={24}>
            <FormItem label="方法名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              {getFieldDecorator('name')(
                <RangePicker
                  format={dateFormat}
                  showTime={{
                    defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                  }}
                />
              )}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.handleLogListModalVisible(true)}>
              日志列表
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
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
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, logListModalVisible } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="suspend">暂停</Menu.Item>
        <Menu.Item key="recovery">恢复</Menu.Item>
        <Menu.Item key="implement">执行</Menu.Item>
      </Menu>
    );
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleModalVisible: this.handleUpdate,
    };
    const logListMethods = {
      handleModalVisible: this.handleLogListModalVisible,
      handleLogListModalVisible: this.handleLogListModalVisible,
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
              {selectedRows.length > 0 && !this.state.DeleteBtn && (
                <span>
                  <Button onClick={this.handleMenuClick}>批量删除</Button>
                </span>
              )}
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
        {logListModalVisible ? (
          <LogListForm
            {...logListMethods}
            logListModalVisible={logListModalVisible}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default TimingManager;

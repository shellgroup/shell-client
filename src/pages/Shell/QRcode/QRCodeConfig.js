import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Modal,
  Badge,
  Divider,
  Radio,
  TreeSelect, DatePicker,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, child } from '../../../utils/utils';
import styles from './QRCodeConfig.less';
import moment from 'moment';

/**
 * 二维码参数配置
 * */
const showDeleteTipsParames = showDeleteConfirmParames();
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const status = ['圆形', '方形'];
const Shape = [
  <Option key={ 0 } value={0} title={"圆形"} >圆形</Option>,
  <Option key={ 1 } value={1} title={"方形"} >方形</Option>
];
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    onChangeTreeSelect,
    isExitQrcodeConfig,
    UserNameOnChange,
    handleChange,
    deptData,
    configName,
    roleData,
    statusValue,
    that,
  } = props;

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err || userName) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  //处理角色数据
  const roleValues = [];
  if (roleData) {
    for (let i = 0; i < roleData.length; i++) {
      roleValues.push(<Option key={ roleData[i].roleId } value={roleData[i].roleId} title={roleData[i].roleName} >{roleData[i].roleName}</Option>);
    }
  }



  function handleConfirmBlur(e) {
    const value = e.target.value;
    that.setState({ confirmDirty: that.state.confirmDirty || !!value });
  }

  function compareToFirstPassword(rule, value, callback) {
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
    } else {
      callback();
    }
  }

  function validateToNextPassword(rule, value, callback) {
    if (value && that.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }


  let formConfigName = {};
  if(configName){
    formConfigName = {
      validateStatus:"error",
      help:"配置名称已存在！"
    }
  }
  return (
    <Modal
      destroyOnClose
      title="新增二维码参数"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配置名称"
        {...formConfigName}
      >
        {form.getFieldDecorator('qrcodeConfigName', {
          rules: [
            { required: true, message: '配置名称!'}
          ],
        })(<Input placeholder="如：**位置码、**导购码" onBlur={isExitQrcodeConfig}/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="高">
        {form.getFieldDecorator('qrcodeHeight', {
          rules: [
            { required: true, message: '请输入二维码的高度！' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="宽">
        {form.getFieldDecorator('qrcodeWidth', {
          rules: [{ required: true, message: '请输入二维码的宽度！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字体大小">
        {form.getFieldDecorator('qrcodeFontSize', {
          rules: [{ required: true, message: '请输入字体大小！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="字体高度">
        {form.getFieldDecorator('qrcodeFontHeight', {
          rules: [{ required: true, message: '请输入字体高度！'}],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="形状">
        {form.getFieldDecorator('qrcodeShape', {
          rules: [{ required: true }],
        })(
          <Select
            style={{ width: '100%' }}
            placeholder="请选形状"
          >
            {Shape}
          </Select>
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="跳转路径">
        {form.getFieldDecorator('qrcodeIndexUrl', {
          rules: [{ required: true, message: '请输入跳转路径！'}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="二维码根目录">
        {form.getFieldDecorator('qrcodePath', {
          rules: [{ required: true, message: '请输入二维码根目录！'}],
        })(<Input placeholder="请输入"/>)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注说明">
        {form.getFieldDecorator('remark', {
          rules: [{ required: false, message: '请输入备注说明！'}],
        })(<Input placeholder="请输入"/>)}
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
        id: props.values.id,
        qrcodeHeight: props.values.qrcodeHeight,
        qrcodeWidth: props.values.qrcodeWidth,
        qrcodeFontSize: props.values.qrcodeFontSize,
        qrcodeFontHeight: props.values.qrcodeFontHeight,
        qrcodeShape: props.values.qrcodeShape,
        qrcodeIndexUrl: props.values.qrcodeIndexUrl,
        qrcodePath:props.values.qrcodePath,
        qrcodeConfigName: props.values.qrcodeConfigName,
        remark: props.values.remark,
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
      values,
      roleData,
      configName,
      isExitQrcodeConfigWhenUpdate,
      deptData,
      handleUpdate,
      that,
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
    let formConfigName = {};
    if(configName){
      formConfigName = {
        validateStatus:"error",
        help:"配置名称已存在！"
      }
    }
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新二维码参数配置"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('id', {
          rules: [{ required: false }],
          initialValue: formVals.id,
        })(<Input type={'hidden'} />)}

        <FormItem
          labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="配置名称"
          {...formConfigName}
        >
          {form.getFieldDecorator('qrcodeConfigName', {
            rules: [
              { required: true, message: '配置名称!'}
            ],
            initialValue: formVals.qrcodeConfigName,
          })(<Input placeholder="如：**位置码、**导购码" data-id={formVals.id} onBlur={isExitQrcodeConfigWhenUpdate}/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="高">
          {form.getFieldDecorator('qrcodeHeight', {
            rules: [
              { required: true, message: '请输入二维码的高度！' },
            ],
            initialValue: formVals.qrcodeHeight,
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="宽">
          {form.getFieldDecorator('qrcodeWidth', {
            rules: [{ required: true, message: '请输入二维码的宽度！'}],
            initialValue: formVals.qrcodeWidth,
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="字体大小">
          {form.getFieldDecorator('qrcodeFontSize', {
            rules: [{ required: true, message: '请输入字体大小！'}],
            initialValue: formVals.qrcodeFontSize,
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="字体高度">
          {form.getFieldDecorator('qrcodeFontHeight', {
            rules: [{ required: true, message: '请输入字体高度！'}],
            initialValue: formVals.qrcodeFontHeight,
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="形状">
          {form.getFieldDecorator('qrcodeShape', {
            rules: [{ required: false }],
            initialValue: formVals.qrcodeShape,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="请选形状"
            >
              {Shape}
            </Select>
          )}
        </FormItem>
        <FormItem {...this.formLayout} label="跳转路径">
          {form.getFieldDecorator('qrcodeIndexUrl', {
            rules: [{ required: true, message: '请输入跳转路径！'}],
            initialValue: formVals.qrcodeIndexUrl,
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="二维码根目录">
          {form.getFieldDecorator('qrcodePath', {
            rules: [{ required: true, message: '请输入二维码根目录！'}],
            initialValue: formVals.qrcodePath,
          })(<Input placeholder="请输入"/>)}
        </FormItem>
        <FormItem {...this.formLayout} label="备注说明">
          {form.getFieldDecorator('remark', {
            rules: [{ required: false, message: '请输入备注说明！'}],
            initialValue: formVals.remark,
          })(<Input placeholder="请输入"/>)}
        </FormItem>
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ QRcodeConfig, dept, role, loading }) => ({
  QRcodeConfig,
  dept,
  role,
  loading: loading.effects[('QRcodeConfig/fetch', 'dept/fetch', 'role/fetch')],
}))
@Form.create()
class QRCodeConfig extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'id', //列表的唯一键
    statusValue: 1, //状态默认选中正常 0正常 1停用
    roleData: [], //角色下拉菜单数据
    deptData: [], //部门树菜单数据
    confirmDirty: false, //确认密码
    confirmDirtyUp: false, //确认密码
    DeleteBtn: false,
    configName: false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
    createTime:{}
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'QRcodeConfig/fetch',
    });
    dispatch({
      type: 'dept/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            deptData: res.list,
          });
        }
      },
    });
    dispatch({
      type: 'role/fetch',
      callback: res => {
        if (res.code == 0) {
          this.setState({
            roleData: res.list,
          });
        }
      },
    });
    //调用utils里面的disablesBtns方法判断是否有权限
    disablesBtns(this);
    this.createTimes = this.createTimes.bind(this);
  }

  columns = [
    {
      title: '码参数ID',
      dataIndex: 'id',
      align:'center',
    },

    {
      title: '配置名称',
      dataIndex: 'qrcodeConfigName',
      align:'center',
    }
    ,
    {
      title: '高度',
      dataIndex: 'qrcodeHeight',
      align:'center',
    },
    {
      title: '宽度',
      dataIndex: 'qrcodeWidth',
      align:'center',
    },
    {
      title: '字体大小',
      dataIndex: 'qrcodeFontSize',
      align:'center',
    },
    {
      title: '字体高度',
      dataIndex: 'qrcodeFontHeight',
      align:'center',
    },
    {
      title: '待跳转页面',
      dataIndex: 'qrcodeIndexUrl',
      align:'center',
    },
    {
      title: '形状',
      dataIndex: 'qrcodeShape',
      align:'center',
      render(val) {
        return <span>{status[val]}</span>;
      },
    },
    {
      title: '存放地址',
      dataIndex: 'qrcodePath',
      align:'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align:'center',
      // sorter: true,
      // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align:'center',
    },
    {
      title: '操作',
      align:'center',
      width: 200,
      render: (text, record) => (
        <Fragment>
          {this.state.UpdateBtn && (
            <Button type={'primary'} onClick={() => this.handleUpdateModalVisible(true, record)}>
              修改
            </Button>
          )}
          {this.state.UpdateBtn && this.state.DeleteBtn && <Divider type="vertical" />}
          {this.state.DeleteBtn && (
            <Button type={'primary'} onClick={() => this.showDeleteConfirm(record)}>
              删除
            </Button>
          )}
        </Fragment>
      ),
    },
  ];

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
      type: 'QRcodeConfig/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      createTime:{}
    });
    dispatch({
      type: 'QRcodeConfig/fetch',
      payload: {},
      callback: res => {
        tips(res);
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  onChangeTreeSelect = value => {
  };
  handleChange = value => {
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
        qrcodeShape: fieldsValue.shape,
        qrcodeConfigName: fieldsValue.name,
        createBeginTime: this.state.createTime.beginDate,
        createEndTime: this.state.createTime.endDate,
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'QRcodeConfig/fetch',
        payload: values,
      });
    });
  };
  //新建二维码参数
  handleModalVisible = flag => {
    const { dept, role } = this.props;

    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    const { dispatch, QRcodeConfig } = this.props;
    fields.qrcodeConfigName = fields.qrcodeConfigName.replace(/\s/g,"");
    dispatch({
      type: 'QRcodeConfig/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'QRcodeConfig/fetch');
        this.setState({
          userName: false
        })
      },
    });


    this.handleModalVisible();
  };
  //修改二维码参数信息
  handleUpdateModalVisible = (flag, record) => {
    const { dept, role } = this.props;
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  //删除用户信息
  showDeleteConfirm = record => {
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.deleted(record);
      },
      onCancel() {
      },
    });
  };
  deleted = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'QRcodeConfig/remove',
      payload: [record.id],
      callback: res => {
        tips(res, this, 'QRcodeConfig/fetch');
      },
    });
  };
  //批量删除
  showDeletesConfirm = () => {
    let that = this;
    confirm({
      ...showDeleteTipsParames,
      onOk() {
        that.handleMenuClick();
      },
      onCancel() {
        that.setState({
          selectedRows: [],
        });
      },
    });
  };
  createTimes(dates, dateStrings) {
    let createTime = {
      beginDate:dateStrings[0],
      endDate:dateStrings[1]
    }
    this.setState({
      createTime:createTime
    });
  };
  handleMenuClick = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.length === 0) return;
    dispatch({
      type: 'QRcodeConfig/remove',
      payload: selectedRows.map(row => row.id),
      callback: res => {
        tips(res, this, 'QRcodeConfig/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });
  };
  isExitQrcodeConfig = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcodedetail/isExitQrcodeConfig',
      payload: {
        qrcodeConfigName: e.target.value.replace(/\s/g,"")
      },
      callback: res => {

        let us = false;
        if(res == "exist"){
          us = true;
        }
        this.setState({
          configName: us,
        });
        dispatch({
          type: 'QRcodeConfig/fetch',
        });
      },
    });
  };
  isExitQrcodeConfigWhenUpdate = e =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcodedetail/isExitQrcodeConfigWhenUpdate',
      payload: {
        qrcodeConfigId:e.currentTarget.getAttribute("data-id"),
        qrcodeConfigName: e.target.value.replace(/\s/g,"")
      },
      callback: res => {

        let us = false;
        if(res == "exist"){
          us = true;
        }
        this.setState({
          configName: us,
        });
        dispatch({
          type: 'QRcodeConfig/fetch',
        });
      },
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    fields.qrcodeConfigName = fields.qrcodeConfigName.replace(/\s/g,"");
    dispatch({
      type: 'QRcodeConfig/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'QRcodeConfig/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });

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
            <FormItem label="配置名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="形状">
              {getFieldDecorator('shape', {
                rules: [{ required: false }],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选形状"
                >
                  {Shape}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
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
            <FormItem label="配置名称">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="形状">
              {getFieldDecorator('shape', {
                rules: [{ required: false }],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选形状"
                >
                  {Shape}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="创建时间">
              <RangePicker
                format={dateFormat}
                showTime={{
                  defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
                }}
                onChange={this.createTimes}
              />
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
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
      QRcodeConfig: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, roleData, deptData, statusValue, ShowList, key, configName } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onChangeTreeSelect: this.onChangeTreeSelect,
      isExitQrcodeConfig: this.isExitQrcodeConfig,
      handleChange: this.handleChange,
      UserNameOnChange: this.UserNameOnChange,
      roleData: roleData,
      configName: configName,
      deptData: deptData,
      statusValue: statusValue,
      that: this,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      isExitQrcodeConfigWhenUpdate:this.isExitQrcodeConfigWhenUpdate,
      configName: configName,
      roleData: roleData,
      deptData: deptData,
      that: this,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {this.state.SaveBtn && (
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                  新建
                </Button>
              )}
              {selectedRows.length > 0 && this.state.DeleteBtn && (
                <span>
                  <Button onClick={this.showDeletesConfirm}>批量删除</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              bordered={true}
              tableAlert={true}
              data={ShowList ? data : {}}
              rowKey={key}
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

export default QRCodeConfig;

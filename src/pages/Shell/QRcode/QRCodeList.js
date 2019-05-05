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
  Dropdown,
  Spin, Alert,
  Modal,
  Menu,
  Badge,
  Divider,
  Radio,
  TreeSelect, DatePicker,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { tips, disablesBtns, showDeleteConfirmParames, child } from '../../../utils/utils';
import styles from './QRCodeList.less';
import moment from 'moment';
/**
 * 二维码列表
 * */
const { RangePicker } = DatePicker;
const showDeleteTipsParames = showDeleteConfirmParames();
const FormItem = Form.Item;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { Option } = Select;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing'];
const status = ['停用', '正常'];
const createtext = ['未生成', '已生成'];
const shape = ['圆形', '方形'];
let infoModal=null;
const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    onChangeTreeSelect,
    UserNameOnChange,
    handleChange,
    deptData,
    userName,
    roleData,
    statusValue,
    that,
  } = props;

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
      title="新增二维码信息"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推广员姓名">
        {form.getFieldDecorator('userName', {
          rules: [
            { required: false, message: '请输入推广员姓名！' },
          ],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="推广员手机号">
        {form.getFieldDecorator('userPhone', {
          rules: [{ required: false, message: '请输入11位手机号码！', min: 11 }],
        })(<Input placeholder="请输入" maxLength={11} />)}
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
    console.log(props,8888888888888);
    this.state = {
      formVals: {
        id: props.values.id,
        userName: props.values.userName,
        userPhone: props.values.userPhone,
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
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="更新二维码信息"
        width={940}
        visible={updateModalVisible}
        onOk={okHandle}
        onCancel={() => handleUpdateModalVisible(false)}
      >
        {form.getFieldDecorator('id', {
          rules: [{ required: false }],
          initialValue: formVals.id,
        })(<Input type={'hidden'} />)}
        <FormItem {...this.formLayout} label="推广员姓名">
          {form.getFieldDecorator('userName', {
            rules: [
              { required: false, message: '请输入推广员姓名！' },
            ],
            initialValue: formVals.userName
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem {...this.formLayout} label="推广员手机号">
          {form.getFieldDecorator('userPhone', {
            rules: [{ required: false, message: '请输入11位手机号码！', min: 11 }],
            initialValue: formVals.userPhone
          })(<Input placeholder="请输入" maxLength={11} />)}
        </FormItem>
      </Modal>
    );
  }
}


@Form.create()
class CreateQrcodeForm extends PureComponent {
  static defaultProps = {
    handleCreateQrcode: () => {},
    handleCreateQrcodeModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        qrcodeData:props.values
      },
      currentStep: 0,
      confirmDirty: false,
    };

    this.formLayout = {
      labelCol: { span: 3 },
      wrapperCol: { span: 15 },
    };
  }

  render() {
    const {
      createQrcodeModalVisible,
      handleCreateQrcodeModalVisible,
      values,
      configChange,
      handleCreateQrcode,
      that,
    } = this.props;
    const { formVals } = this.state;
    const { form } = this.props;


    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleCreateQrcode(fieldsValue);
      });
    };
    const qrCodeConfigInfo = that.state.qrCodeConfigInfo;
    let roleValues = [];

    for (let i = 0; i < formVals.qrcodeData.length; i++) {
      roleValues.push(<Option key={formVals.qrcodeData[i].id} value={formVals.qrcodeData[i].id} title={formVals.qrcodeData[i].qrcodeConfigName} >{formVals.qrcodeData[i].qrcodeConfigName}</Option>);
    }

    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="二维码生成参数绑定"
        width={940}
        visible={createQrcodeModalVisible}
        onOk={okHandle}
        onCancel={() => handleCreateQrcodeModalVisible(false)}
      >





        {form.getFieldDecorator('qrcodeIds', {
          rules: [{ required: false }],
          initialValue: that.state.createQrcodeItem,
        })(<Input type={'hidden'} />)}

        <FormItem {...this.formLayout} label="配置名称">
          {form.getFieldDecorator('qrcodeConfigId', {
            rules: [{ required: true, message: '请选择配置名称！' }]
          })(
            <Select
              style={{ width: '100%' }}
              placeholder="配置名称"
              onChange={configChange}
            >
              {roleValues}
            </Select>
          )}
        </FormItem>


        <div className={styles.left}>
          <div className={styles.address}>
            <span className={styles.spanTitle}>高度:</span>
            {qrCodeConfigInfo.qrcodeHeight && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeHeight}</span>}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>宽度:</span>
            {qrCodeConfigInfo.qrcodeWidth && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeWidth}</span>}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>字体大小:</span>
            {qrCodeConfigInfo.qrcodeFontSize && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeFontSize}</span>}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>字体高度:</span>
            {qrCodeConfigInfo.qrcodeFontHeight && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeFontHeight}</span>}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>形状:</span>
            {qrCodeConfigInfo.qrcodeShape==0?<span className={styles.imgpath}>{shape[0]}</span>:qrCodeConfigInfo.qrcodeShape==1?<span className={styles.imgpath}>{shape[1]}</span>:""}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>类型:</span>
            {qrCodeConfigInfo.qrcodeTypeName && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeTypeName}</span>}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>待跳转路径:</span>
            {qrCodeConfigInfo.qrcodeIndexUrl && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeIndexUrl}</span>}
          </div>
          <div className={styles.address}>
            <span className={styles.spanTitle}>配置名称:</span>
            {qrCodeConfigInfo.qrcodeConfigName && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodeConfigName}</span>}
          </div>

          <div className={styles.address}>
            <span className={styles.spanTitle}>二维码目录:</span>
            {qrCodeConfigInfo.qrcodePath && <span className={styles.imgpath}>{qrCodeConfigInfo.qrcodePath}</span>}
          </div>
          <div>
            <span className={styles.spanTitle}>创建时间:</span>
            {qrCodeConfigInfo.createTime && <span className={styles.imgpath}>{qrCodeConfigInfo.createTime}</span>}
          </div>
        </div>



      </Modal>
    );
  }
}

@Form.create()
class DetailQrcodeForm extends PureComponent {
  static defaultProps = {
    handleDetail: () => {},
    handleDetailModalVisible: () => {},
    values: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        imgName: props.values.imgName,
        imgPath: props.values.imgPath,
        imgBase64: props.values.imgBase64,
        imgTime: props.values.imgTime,
        deptCode: props.values.deptCode,
        deptName: props.values.deptName,
        isCreateQrcode: props.values.isCreateQrcode,
        userName: props.values.userName,
        userPhone: props.values.userPhone,
        createTime:props.values.createTime,
      },
      currentStep: 0,
      confirmDirty: false,
    };

  }

  render() {
    const {
      detailModalVisible,
      handleDetailModalVisible,
      values,
      handleDetail,
      that,
    } = this.props;
    const { formVals } = this.state;
    const { form } = this.props;


    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleDetail(fieldsValue);
      });
    };
    return (
      <Modal
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="二维码详细信息"
        width={940}
        footer={null}
        visible={detailModalVisible}
        onOk={okHandle}
        onCancel={() => handleDetailModalVisible(false)}
      >
        <div className={styles.infoBox}>
          <div className={styles.left}>
            <div>
              <span className={styles.spanTitle}>二维码名称:</span>
              {formVals.imgName && <span>{formVals.imgName}</span>}
            </div>
            <div className={styles.address}>
              <span className={styles.spanTitle}>二维码地址:</span>
              {formVals.imgPath && <span className={styles.imgpath}>{formVals.imgPath}</span>}
            </div>
            <div>
              <span className={styles.spanTitle}>生成时间:</span>
              {formVals.imgTime && <span>{formVals.imgTime}</span>}
            </div>
            <div>
              <span className={styles.spanTitle}>推广码:</span>
              {formVals.deptCode && <span>{formVals.deptCode}</span>}
            </div>
            <div>
              <span className={styles.spanTitle}>渠道商:</span>
              {formVals.deptName && <span>{formVals.deptName}</span>}
            </div>
            <div>
              <span className={styles.spanTitle}>是否生成:</span>
              {formVals.isCreateQrcode == 0?<span>{createtext[0]}</span>:formVals.isCreateQrcode==1?<span>{createtext[1]}</span>:""}
            </div>
            <div>
              <span className={styles.spanTitle}>推广员姓名:</span>
              {formVals.userName && <span>{formVals.userName}</span>}
            </div>
            <div>
              <span className={styles.spanTitle}>推广员手机号:</span>
              {formVals.userPhone && <span>{formVals.userPhone}</span>}
            </div>
            <div>
              <span className={styles.spanTitle}>创建时间:</span>
              {formVals.createTime && <span>{formVals.createTime}</span>}
            </div>
          </div>
          <div className={styles.right}>
            {formVals.imgPath && <img className={styles.img} src={formVals.imgBase64}/>}
          </div>
        </div>
      </Modal>
    );
  }
}
/* eslint react/no-multi-comp:0 */
@connect(({ qrcode, dept, role, loading }) => ({
  qrcode,
  dept,
  role,
  loading: loading.effects[('qrcode/fetch', 'dept/fetch', 'role/fetch')],
}))
@Form.create()
class QRCodeList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    createQrcodeModalVisible: false,
    detailModalVisible:false,
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
    userName: false,
    createqrCodeBtn:false,
    createqrCodesBtn:false,
    SaveBtn: false,
    UpdateBtn: false,
    ShowList: false,
    createTime:{},
    createQrcodeItem:[], //所选生成二维码的对象
    qrCodeConfigInfo:{} //二维码参数对象
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcode/fetch',
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
      title: '二维码ID',
      dataIndex: 'id',
      align:'center',
    },
    // {
    //   title: '二维码类型',
    //   dataIndex: 'mallType',
    //   align:'center',
    // },
    {
      title: '渠道名称',
      dataIndex: 'deptName',
      align: 'center',
    },
    ,
    {
      title: '生成状态',
      dataIndex: 'isCreateQrcode',
      align:'center',
      // filters: [
      //   {
      //     text: status[0],
      //     value: 0,
      //   },
      //   {
      //     text: status[1],
      //     value: 1,
      //   },
      // ],
      render(val) {
        return <Badge status={statusMap[val]} text={createtext[val]} />;
      },
    },
    {
      title: '生成时间',
      dataIndex: 'imgTime',
      align:'center',
      // sorter: true,
      // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      align:'center',
      width: 400,
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
          {this.state.UpdateBtn && this.state.DeleteBtn && <Divider type="vertical" />}
          {this.state.DeleteBtn && (
            <Button type={'primary'} onClick={() => this.handleDetailModalVisible(true,record)}>
              查看
            </Button>
          )}
          {this.state.createqrCodeBtn && this.state.DeleteBtn && <Divider type="vertical" />}
          {this.state.createqrCodeBtn && (
            <Button type={'primary'} onClick={() => this.handleCreateQrcodeModalVisible(true, [record.id])}>
              二维码生成
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
      type: 'qrcode/fetch',
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
      type: 'qrcode/fetch',
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
        id: fieldsValue.qrid,
        mallType: fieldsValue.qrtype,
        deptId: fieldsValue.deptNo,
        beginDate: this.state.createTime.beginDate,
        endDate: this.state.createTime.endDate,
      };



      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'qrcode/fetch',
        payload: values,
      });
    });
  };
  //新建二维码信息
  handleModalVisible = flag => {
    const { dept, role } = this.props;

    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = fields => {
    const { dispatch, qrcode } = this.props;
    dispatch({
      type: 'qrcode/add',
      payload: fields,
      callback: res => {
        tips(res, this, 'qrcode/fetch');
      },
    });


    this.handleModalVisible();
  };
  //修改二维码信息
  handleUpdateModalVisible = (flag, record) => {
    const { dept, role } = this.props;
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };
  //删除二维码信息
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
      type: 'qrcode/remove',
      payload: [record.id],
      callback: res => {
        tips(res, this, 'qrcode/fetch');
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
  //二维码生成弹窗
  handleCreateQrcodeModalVisible = (flag,record) => {

    if(record && Object.keys(record).length){
      const { dispatch } = this.props;
      dispatch({
        type: 'qrcodedetail/getQrcodeConfigList',
        payload: "",
        callback: res => {
          this.setState({
            qrCodeConfigInfo:{},
            createQrcodeItem:record,
            createQrcodeModalVisible: !!flag,
            stepFormValues: res.qrcodeConfigList || {},
          });
        },
      });
    }else{
      this.setState({
        createQrcodeItem:[],
        qrCodeConfigInfo:{},
        createQrcodeModalVisible: !!flag,
        stepFormValues: record || {},
      });
    }

  };
  //查看详情
  handleDetailModalVisible = (flag,record) => {
    if(!!record){
      const { dispatch } = this.props;
      dispatch({
        type: 'qrcodedetail/queryQrcodeDetail',
        payload: parseInt(record.id),
        callback: res => {
          this.setState({
            stepFormValues: res.qrCodeInfo || {},
            detailModalVisible: !!flag,
          });
        },
      });
    }else{
      this.setState({
        stepFormValues: record || {},
        detailModalVisible: !!flag,
      });
    }

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

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.length === 0) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'qrcode/remove',
          payload: {
            key: selectedRows.map(row => row.id),
          },
          callback: () => {
            tips(res, this, 'qrcode/fetch');
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      case 'createQrcode':
        //二维码批量生成
        this.handleCreateQrcodeModalVisible(true,selectedRows.map(row => row.id));
        break;
      default:
        break;
    }
  };
  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcode/update',
      payload: fields,
      callback: res => {
        tips(res, this, 'qrcode/fetch');
        this.setState({
          selectedRows: [],
        });
      },
    });

    this.handleUpdateModalVisible();
  };
  info() {
    infoModal = Modal.info({
      title: '二维码生成',
      content: (
        <Spin tip="请稍等，此操作可能需要一段时间！"></Spin>
      ),
      onOk() {},
      okButtonProps: {
        disabled: true,
      },
    });

  };
  handleCreateQrcode = fields => {
    this.info();
    const { dispatch } = this.props;

    dispatch({
      type: 'qrcodedetail/createqrCodes',
      payload: fields,
      callback: (res) => {
        if(!!res.msg){
          infoModal.update({
            content: (
              <div>
                {res.msg.split(' ').map(list => (<p>{list}</p>))}
              </div>
            ),
            okButtonProps: {
              disabled: false,
            },
          });
        }
      },
    });


    this.handleCreateQrcodeModalVisible();
  };
  handleDetail = fields => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'qrcode/createqrCode',
    //   payload: [record.id],
    //   callback: res => {
    //     tips(res, this, 'qrcode/fetch');
    //   },
    // });

    //this.handleCreateQrcodeModalVisible();
  };
  //配置名称选择触发事件查询该参数的详细信息
  configChange = value => {
    const { dispatch } = this.props;
    dispatch({
      type: 'qrcodeParameter/queryQrcodeConfigDetail',
      payload: parseInt(value),
      callback: res => {
        this.setState({
          qrCodeConfigInfo: res.qrCodeConfigInfo || {},
        });
      },
    });
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="二维码ID">
              {getFieldDecorator('qrid')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二维码类型">
              {getFieldDecorator('qrtype')(<Input placeholder="请输入" />)}
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
            <FormItem label="二维码ID">
              {getFieldDecorator('qrid')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="二维码类型">
              {getFieldDecorator('qrtype')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="渠道ID">
              {getFieldDecorator('deptNo')(<Input placeholder="请输入" />)}
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
      qrcode: { data },
      loading,
    } = this.props;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        {this.state.createqrCodeBtn && <Menu.Item key="remove">删除</Menu.Item>}
        {this.state.createqrCodesBtn && <Menu.Item key="createQrcode">二维码生成</Menu.Item>}
      </Menu>
    );
    const { selectedRows, modalVisible, updateModalVisible,detailModalVisible, createQrcodeModalVisible, stepFormValues, roleData, deptData, statusValue, ShowList, key, userName } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      onChangeTreeSelect: this.onChangeTreeSelect,
      handleChange: this.handleChange,
      UserNameOnChange: this.UserNameOnChange,
      roleData: roleData,
      userName: userName,
      deptData: deptData,
      statusValue: statusValue,
      that: this,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      roleData: roleData,
      deptData: deptData,
      that: this,
    };
    const createQrcodeMethods = {
      handleCreateQrcodeModalVisible: this.handleCreateQrcodeModalVisible,
      handleCreateQrcode: this.handleCreateQrcode,
      configChange: this.configChange,
      that: this,
    };
    const detailMethods = {
      handleDetailModalVisible: this.handleDetailModalVisible,
      handleDetail: this.handleDetail,
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
              {selectedRows.length > 0 && (
                <span>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
              {/*{selectedRows.length > 0 && this.state.DeleteBtn && (*/}
              {/*  <span>*/}
              {/*    <Button onClick={this.showDeletesConfirm}>批量删除</Button>*/}
              {/*  </span>*/}
              {/*)}*/}
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
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <CreateQrcodeForm
            {...createQrcodeMethods}
            createQrcodeModalVisible={createQrcodeModalVisible}
            values={stepFormValues}
          />
        ) : null}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <DetailQrcodeForm
            {...detailMethods}
            detailModalVisible={detailModalVisible}
            values={stepFormValues}
          />
        ) : null}

      </PageHeaderWrapper>
    );
  }
}

export default QRCodeList;

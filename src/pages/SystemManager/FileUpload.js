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
  Radio,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './FileUpload.less';
import {tips} from "../../utils/utils";

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['normal', 'disabled'];
const status = ['正常', '停用'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible, that, btnType, configData } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  const viewArr = [
    [
      {
        label:'域名',
        name: 'qiniuDomain',
        value: '',
        message:'请输入七牛绑定的域名！',
        placeholder:'七牛绑定的域名',
        mark: 0
      },
      {
        label:'路径前缀',
        name: 'qiniuPrefix',
        value: '',
        message:'请输入路径前缀！',
        placeholder:'不设置默认为空',
        mark: 0
      },
      {
        label:'AccessKey',
        name: 'qiniuAccessKey',
        value: '',
        message:'请输入七牛AccessKey！',
        placeholder:'七牛AccessKey',
        mark: 0
      },
      {
        label:'SecretKey',
        name: 'qiniuSecretKey',
        value: '',
        message:'请输入七牛SecretKey！',
        placeholder:'七牛SecretKey',
        mark: 0
      },
      {
        label:'空间名',
        name: 'qiniuBucketName',
        value: '',
        message:'请输入七牛存储空间名！',
        placeholder:'七牛存储空间名',
        mark: 0
      }
    ],[
      {
        label:'域名',
        name: 'aliyunDomain',
        value: '',
        message:'请输入阿里云绑定的域名！',
        placeholder:'阿里云绑定的域名',
        mark: 1
      },
      {
        label:'路径前缀',
        name: 'aliyunPrefix',
        value: '',
        message:'请输入路径前缀！',
        placeholder:'不设置默认为空',
        mark: 1
      },
      {
        label:'EndPoint',
        name: 'aliyunEndPoint',
        value: '',
        message:'请输入阿里云EndPoint！',
        placeholder:'阿里云EndPoint',
        mark: 1
      },
      {
        label:'AccessKeyId',
        name: 'aliyunAccessKeyId',
        value: '',
        message:'请输入阿里云AccessKeyId！',
        placeholder:'阿里云AccessKeyId',
        mark: 1
      },
      {
        label:'AccessKeySecret',
        name: 'aliyunAccessKeySecret',
        value: '',
        message:'请输入阿里云AccessKeySecret！',
        placeholder:'阿里云AccessKeySecret',
        mark: 1
      },
      {
        label:'BucketName',
        name: 'aliyunBucketName',
        value: '',
        message:'请输入阿里云BucketName！',
        placeholder:'阿里云BucketName',
        mark: 1
      }
    ],[
      {
        label:'域名',
        name: 'qcloudDomain',
        value: '',
        message:'请输入腾讯云绑定的域名！',
        placeholder:'腾讯云绑定的域名',
        mark: 2
      },
      {
        label:'路径前缀',
        name: 'qcloudPrefix',
        value: '',
        message:'请输入路径前缀！',
        placeholder:'不设置默认为空',
        mark: 2
      },
      {
        label:'AppId',
        name: 'qcloudAppId',
        value: '',
        message:'请输入腾讯云AppId！',
        placeholder:'腾讯云AppId',
        mark: 2
      },
      {
        label:'SecretId',
        name: 'qcloudSecretId',
        value: '',
        message:'请输入腾讯云SecretId！',
        placeholder:'腾讯云SecretId',
        mark: 2
      },
      {
        label:'SecretKey',
        name: 'qcloudSecretKey',
        value: '',
        message:'请输入腾讯云SecretKey！',
        placeholder:'腾讯云SecretKey',
        mark: 2
      },
      {
        label:'BucketName',
        name: 'qcloudBucketName',
        value: '',
        message:'请输入腾讯云BucketName！',
        placeholder:'腾讯云BucketName',
        mark: 2
      },
      {
        label:'Bucket所属地区',
        name: 'qcloudRegion',
        value: '',
        message:'请输入Bucket所属地区！',
        placeholder:'如：sh（可选值 ，华南：gz 华北：tj 华东：sh',
        mark: 2
      }
    ]
  ];
  let dataArr = [];
  const viewDataFunction = data =>{
    for(let i =0;i<data.length;i++){
      if(data[i] instanceof Array){
        viewDataFunction(data[i]);
      }else{
        if(configData){
          Object.keys(configData).map((key) => {
            if(data[i].name == key){
              data[i].value = configData[key];
              data[i].mark == btnType && dataArr.push(
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} key={i} label={data[i].label}>
                  {form.getFieldDecorator(`${data[i].name}`, {
                    rules: [{ required: false, message: `${data[i].message}`}],
                    initialValue: data[i].value
                  })(<Input placeholder={data[i].placeholder} />)}
                </FormItem>
              );
            }
          });
        }
      }
    }
    return dataArr;
  }

  return (
    <Modal
      destroyOnClose
      title="云存储配置"
      width={940}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="型&emsp;&emsp;类">
        {form.getFieldDecorator('type', {
          rules: [{ required: false }],
          initialValue: btnType,
        })(
          <RadioGroup onChange={that.onChangebtnType} >
            <Radio value={0}>七牛云</Radio>
            <Radio value={1}>阿里云</Radio>
            <Radio value={2}>腾讯云</Radio>
          </RadioGroup>
        )}
      </FormItem>
      {viewDataFunction(viewArr)}
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
        name: props.values.name,
        desc: props.values.desc,
        key: props.values.key,
        target: '0',
        template: '0',
        type: '1',
        time: '',
        frequency: 'month',
      },
      currentStep: 0,
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };
  }

  handleNext = currentStep => {
    const { form, handleUpdate } = this.props;
    const { formVals: oldValue } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const formVals = { ...oldValue, ...fieldsValue };
      this.setState(
        {
          formVals,
        },
        () => {
          if (currentStep < 2) {
            this.forward();
          } else {
            handleUpdate(formVals);
          }
        }
      );
    });
  };

  backward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep - 1,
    });
  };

  forward = () => {
    const { currentStep } = this.state;
    this.setState({
      currentStep: currentStep + 1,
    });
  };
}

/* eslint react/no-multi-comp:0 */
@connect(({ fileupload, loading }) => ({
  fileupload,
  loading: loading.models.fileupload,
}))
@Form.create()
class FileUpload extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    key: 'id',
    btnType: 0,
    configData:{}
  };

  columns = [
    {
      title: 'URL地址',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createtime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <Fragment>
          <a onClick={() => this.handleUpdateModalVisible(true, record)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'fileupload/fetch',
    });
    dispatch({
      type: 'fileupload/config',
      callback:(res)=>{
        this.setState({
          configData:res.config
        })
      }
    });
  }
  onChangebtnType = (e) => {
    let value = e.target.value;
    this.setState({
      btnType:value
    })

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
      type: 'fileupload/fetch',
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
      type: 'fileupload/fetch',
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
          type: 'fileupload/remove',
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
        type: 'fileupload/fetch',
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
    const { dispatch } = this.props;
    dispatch({
      type: 'fileupload/add',
      payload: fields,
      callback:(res)=>{
        tips(res, this, 'fileupload/fetch');
      }
    });

    //message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'fileupload/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  render() {
    const {
      fileupload: { data },
      loading,
    } = this.props;
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues, btnType, configData } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      that: this,
      btnType: btnType,
      configData: configData
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm} />
            <div className={styles.tableListOperator}>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                云存储配置
              </Button>
              <Button type="primary" onClick={() => this.handleModalVisible(true)}>
                文件上传
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

export default FileUpload;

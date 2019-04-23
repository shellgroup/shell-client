import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import {Button, Input, Form, Row, Col} from "antd";
import styles from "../SystemManager/DictionaryManager.less";
import {connect} from "dva";

@connect(({ testPage, loading}) => ({
  testPage,
  loading: loading.effects["testPage/fetch"],
}))


@Form.create()
class testPage extends Component {
  test = e => {
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
        type: 'testPage/fetch',
        payload: values,
        callback: (response) =>{
          console.log("回调显示：：：：：",response);
        }
      });
    });
  };



  render() {
    const { form }= this.props;
    const FormItem = Form.Item;
    return (
      <Form onSubmit={this.test} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户名">
              {form.getFieldDecorator('userName')(<Input placeholder="请输入" />)}
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
}

export default testPage;

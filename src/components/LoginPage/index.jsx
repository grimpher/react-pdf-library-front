import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { login } from '../../redux/actions'

import { Row, Col, Card, Typography, Form, Input, Icon, Button, Alert } from 'antd'
const { Title, Text } = Typography

class LoginPage extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  }

  state = {
    emailValue: '',
    passwordValue: '',
    shouldRedirect: false,
    feedbackMessage: null,
    loginInProgress: false
  }

  submitLoginForm = (e) => {
    e.preventDefault()
    const { emailValue, passwordValue } = this.state
    if (!emailValue || !passwordValue) {
      return this.setState({ feedbackMessage: 'Fill in all form inputs' })
    }

    if (!emailValue.includes('@') || !emailValue.includes('.')) {
      return this.setState({ feedbackMessage: 'Email incorrect' })
    }

    this.setState({ loginInProgress: true })
    this.props.login(emailValue, passwordValue)
      .then(() => {
        setTimeout(() => {
          this.setState({ shouldRedirect: true })
        }, 2000)
      })
      .catch(errMessage => {
        this.setState({ feedbackMessage: errMessage, loginInProgress: false })
      })
  }

  changeInput = (e) => {
    const { value, name } = e.target
    this.setState({
      [name + 'Value']: value
    })
  }

  render() {

    const loginFeedback = (
      <div style={{ marginBottom: '2em' }}>
        { this.state.feedbackMessage && <Alert message={ this.state.feedbackMessage } type="error" showIcon /> }
      </div>
    )

    return (
      <Row>
        { this.state.shouldRedirect && <Redirect to="/" /> }
        <Col span={8} offset={8}>
          <Card style={{ margin: '50px 0', borderRadius: '25px', boxShadow: '0 0 20px aliceblue' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Login</Title>

            <Row>
              <Col span={16} offset={4}>

                { loginFeedback }

                <Form onSubmit={this.submitLoginForm}>
                  <Form.Item>
                    <Input
                      prefix={<Icon type="mail" />}
                      placeholder="Email"
                      name="email"
                      onChange={this.changeInput}
                      value={this.state.emailValue}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      type="password"
                      prefix={<Icon type="lock" />}
                      placeholder="Password"
                      name="password"
                      onChange={this.changeInput}
                      value={this.state.passwordValue}
                    />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" loading={this.state.loginInProgress}>Log in</Button>
                  <Text style={{ margin: '0 1em' }}>or</Text>
                  <Link to="/register">
                    <Button type="secondary">Register</Button>
                  </Link>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  login: (email, password) => dispatch(login(email, password))
})

export default connect(null, mapDispatchToProps)(LoginPage)
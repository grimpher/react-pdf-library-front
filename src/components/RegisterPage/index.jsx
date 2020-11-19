import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'

import { register } from '../../redux/actions'

import { Row, Col, Card, Typography, Form, Input, Icon, Button, Alert } from 'antd'
const { Title, Text } = Typography

class RegisterPage extends Component {
  static propTypes = {
    register: PropTypes.func.isRequired
  }

  state = {
    emailValue: '',
    passwordValue: '',
    passwordRepeatValue: '',
    firstNameValue: '',
    shouldRedirect: false,
    feedbackMessage: null,
    registerInProgress: false
  }

  submitRegisterForm = (e) => {
    e.preventDefault()
    const { emailValue, passwordValue, firstNameValue, passwordRepeatValue } = this.state
    if (!emailValue || !passwordValue || !firstNameValue || !passwordRepeatValue) {
      return this.setState({ feedbackMessage: 'Fill in all form inputs' })
    }

    if (passwordRepeatValue !== passwordValue) {
      return this.setState({ feedbackMessage: 'Passwords are not the same'})
    }

    if (!emailValue.includes('@') || !emailValue.includes('.')) {
      return this.setState({ feedbackMessage: 'Email incorrect' })
    }

    this.setState({ registerInProgress: true })
    this.props.register(emailValue, passwordValue, firstNameValue)
      .then(() => {
        setTimeout(() => {
          this.setState({ shouldRedirect: true })
        }, 2000)
      })
      .catch(errMessage => {
        this.setState({ feedbackMessage: errMessage, registerInProgress: false })
      })
  }

  changeInput = (e) => {
    const { value, name } = e.target
    this.setState({
      [name + 'Value']: value
    })
  }

  render () {

    const registerFeedback = (
      <div style={{ marginBottom: '2em' }}>
        { this.state.feedbackMessage && <Alert message={ this.state.feedbackMessage } type="error" showIcon /> }
      </div>
    )

    return (
      <Row>
        { this.state.shouldRedirect && <Redirect to="/" /> }
        <Col span={8} offset={8}>
          <Card style={{ margin: '50px 0', borderRadius: '25px', boxShadow: '0 0 20px aliceblue' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Register</Title>

            <Row>
              <Col span={16} offset={4}>

                { registerFeedback }

                <Form onSubmit={this.submitRegisterForm}>
                  <Form.Item>
                    <Input 
                      prefix={<Icon type="mail" />}
                      placeholder="Email"
                      name="email"
                      onChange={this.changeInput}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input 
                      prefix={<Icon type="user" />}
                      placeholder="First name"
                      name="firstName"
                      onChange={this.changeInput}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      type="password"
                      prefix={<Icon type="lock" />}
                      placeholder="Password"
                      name="password"
                      onChange={this.changeInput}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Input
                      type="password"
                      prefix={<Icon type="lock" />}
                      placeholder="Confirm password"
                      name="passwordRepeat"
                      onChange={this.changeInput}
                    />
                  </Form.Item>

                  <Button type="primary" htmlType="submit" loading={this.state.registerInProgress}>Register</Button>
                  <Text style={{ margin: '0 1em' }}>or</Text>
                  <Link to="/login">
                    <Button type="secondary">Log in</Button>
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
  register: (email, password, firstName) => dispatch(register(email, password, firstName))
})

export default connect(null, mapDispatchToProps)(RegisterPage)
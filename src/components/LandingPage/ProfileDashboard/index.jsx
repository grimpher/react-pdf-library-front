import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { logout, fetchUserInfo } from '../../../redux/actions'

import UserPreferences from './UserPreferences.jsx'

import { Typography,
         Row,
         Col,
         Button,
         Progress,
         Spin } from 'antd'
const { Title, Paragraph } = Typography

class ProfileDashboard extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    fetchUserInfo: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  }

  state = {
    isLoading: true,
    currentDate: ''
  }

  componentDidMount () {
    const today = new Date()
    let day = today.getDate()
    day = day < 10 ? '0' + day : day
    let month = today.getMonth() + 1
    month = month < 10 ? '0' + month : month
    const year = today.getFullYear()

    const currentDate = `${day}-${month}-${year}`

    this.props.fetchUserInfo()
      .then(() => {
        this.setState({ isLoading: false, currentDate })
      })
  }

  render () {
    const { firstName, preferences } = this.props.user
    let todayPagesRead = 0
    let todayMinutesRead = 0

    if (this.props.user.stats[this.state.currentDate]) {
      const todayStats = this.props.user.stats[this.state.currentDate]
      todayPagesRead = todayStats.pages || 0
      todayMinutesRead = todayStats.minutes || 0
    }

    const { dailyGoals } = preferences
    const { isLoading } = this.state

    let dailyGoalsPercentages = {
      pages: Math.round(todayPagesRead / dailyGoals.pages * 100),
      minutes: Math.round(todayMinutesRead / dailyGoals.minutes * 100)
    }
    if (dailyGoals.pages === 0) dailyGoalsPercentages.pages = 100
    if (dailyGoals.minutes === 0) dailyGoalsPercentages.minutes = 100

    return (
      <div>
        <Spin spinning={isLoading}>
          <Row type="flex" justify="space-between">
            <Col>
              <Title level={3}>
                Hello, {firstName}
              </Title>
            </Col>
            <Col>
              <Button type="link" onClick={this.props.logout}>Log out</Button>
            </Col>
          </Row>
          <Row>
            <Title level={4} type="secondary" style={{fontWeight: '200'}}>
              Your daily goals
            </Title>
            <Row type="flex" justify="space-around" style={{ marginTop: '2em' }}>
              <Col>
                <Progress percent={dailyGoalsPercentages.pages} type="circle" />
                <Paragraph style={{textAlign: 'center', marginTop: "1em"}}>
                  {todayPagesRead}{dailyGoals.pages > 0 && '/' + dailyGoals.pages} pages
                </Paragraph>
              </Col>
              {/* <Col>
                <Progress percent={dailyGoalsPercentages.minutes} type="circle" />
                <Paragraph style={{textAlign: 'center', marginTop: "1em"}}>
                  {todayMinutesRead}{dailyGoals.minutes > 0 && '/' + dailyGoals.minutes} minutes
                </Paragraph>
              </Col> */}
            </Row>
          </Row>
          
          <UserPreferences />
        </Spin>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
  fetchUserInfo: () => dispatch(fetchUserInfo())
})

const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDashboard)
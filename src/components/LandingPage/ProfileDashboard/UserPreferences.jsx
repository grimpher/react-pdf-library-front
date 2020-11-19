import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import { updateUserPreferences } from '../../../redux/actions'

import {
  Typography, Row, Slider, Button, Form
} from 'antd'
const { Paragraph } = Typography

class UserPreferences extends Component {
  static propTypes = {
    preferences: PropTypes.object.isRequired,
    updateUserPreferences: PropTypes.func.isRequired
  }

  state = {
    newPreferences: this.props.preferences,
    isPushing: false
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.preferences !== this.props.preferences) {
      this.setState({ newPreferences: this.props.preferences })
    }
  }

  onChangeSlider = (property) => (newValue) => {
    this.setState(prevState => ({ 
      newPreferences: {
        ...prevState.newPreferences,
        dailyGoals: {
          ...prevState.newPreferences.dailyGoals,
          [property]: newValue
        }
      } 
    }))
  }

  pushChanges = (e) => {
    if (e) e.preventDefault()
    if (this.state.newPreferences === this.props.preferences) return

    this.setState({ isPushing: true })
    this.props.updateUserPreferences(this.state.newPreferences)
      .then(() => {
        this.setState({ isPushing: false })
      })
  }

  render() {

    const { pages, minutes } = this.state.newPreferences.dailyGoals
    const { isPushing } = this.state

    return (
      <React.Fragment>
        <Form onSubmit={this.pushChanges}>
          <Row>
            <Paragraph>
              Pages to read a day
            </Paragraph>
            <Slider value={pages} onChange={this.onChangeSlider('pages')} max={500} step={5} />
          </Row>
          {/* <Row>
            <Paragraph>
              Minutes to read a day
            </Paragraph>
            <Slider value={minutes} onChange={this.onChangeSlider('minutes')} max={60} />
          </Row> */}
          <Row type="flex" justify="end">
            <Button htmlType="submit" type="primary" loading={isPushing}>
              Save
            </Button>
          </Row>
        </Form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  preferences: state.user.preferences
})

const mapDispatchToProps = dispatch => ({
  updateUserPreferences: (newPreferences) => dispatch(updateUserPreferences(newPreferences))
})
 
export default connect(mapStateToProps, mapDispatchToProps)(UserPreferences);
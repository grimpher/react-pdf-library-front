import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { readCache } from './redux/actions'

import LandingPage from './components/LandingPage'
import FilePage from './components/FilePage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'

class App extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    readCache: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.props.readCache()
  }

  render () {
    return (
      <Router>
        <Route path='/' exact component={LandingPage} />
        <Route path='/file/:id' exact component={FilePage} />
        <Route path='/login' exact component={LoginPage} />
        <Route path='/register' exact component={RegisterPage} />
      </Router>
    )
  }
}


const mapStateToProps = state => ({
  user: state.user
})
const mapDispatchToProps = dispatch => ({
  readCache: () => dispatch(readCache())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchSingleFile, updateFile } from '../../redux/actions'

import { Icon, Tooltip } from 'antd'
import './FilePage.scss'

class FilePage extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    file: PropTypes.object.isRequired,
    fetchFile: PropTypes.func.isRequired,
    updateFile: PropTypes.func.isRequired
  }

  state = {
    fileInfo: {},
    currentPage: null,
    lastUpdatedCurrentPage: null,
    lastPageChangeTime: new Date().getTime(),
    minutesOfReading: 0
  }

  constructor(props) {
    super(props)
    this.onMessage = this.onMessage.bind(this)
  }
  
  componentDidMount = () => {
    const niceId = this.props.match.params.id

    this.props.fetchFile(niceId)
    // iframe -> parent communication hack
    window.addEventListener('message', this.onMessage)

    setInterval(() => {
      const timeNow = new Date().getTime()
      if (this.state.lastPageChangeTime + 1000 * 60 * 10 > timeNow) {
        this.setState( prevState => ({minutesOfReading: prevState.minutesOfReading + 1}))
      }
    }, 1000 * 60)
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.updateReadPagesCount()

    if (prevState.lastUpdatedCurrentPage !== this.state.lastUpdatedCurrentPage) {
      const timeNow = new Date().getTime()
      this.setState({ lastPageChangeTime: timeNow })
    }
  }

  updateReadPagesCount = async () => {
    const didValueChange = this.state.lastUpdatedCurrentPage !== this.state.currentPage
    const isValueGrater = this.state.currentPage > this.props.file.pagesRead
    if (isValueGrater && didValueChange) {

      const dataToUpdate = {
        pagesRead: this.state.currentPage,
        minutesOfReading: this.state.minutesOfReading
      }
      this.props.updateFile(this.props.file.niceId, dataToUpdate)
        .then(() => {
          this.setState({ lastUpdatedCurrentPage: this.state.currentPage, minutesOfReading: 0 })
          Promise.resolve()
        })
        .catch(err => {
          Promise.reject(err)
        })
    }
  }
  
  onMessage = (e) => {
    if (!isNaN(parseInt(e.data))) {
      const currentPage = parseInt(e.data)
      this.setState({ currentPage: currentPage })
    }
  }
  
  render = () => {

    const pagesRead = this.props.file.pagesRead
    const filePath = window.location.protocol + '//' + window.location.host + '/' + this.props.file.path
    const viewerSrc = `/public/pdfJs/web/viewer.html?file=${encodeURI(filePath)}#page=${pagesRead}`

    return (
      <div style={{height: '100vh', display:'flex', flexDirection:'column'}}>

        <Link to="/" onClick={this.updateReadPagesCount}>
          <Tooltip placement="right" title="Back to homepage">
            <div className="floating-back-button">
              <Icon type="arrow-left" />
            </div>
          </Tooltip>
        </Link>
      
        <iframe
          id="pdfView"
          title="pdfViewer"
          src={viewerSrc} 
          width="100%"
          style={{border: 0, height: '100%'}}
        />

      </div>
    )
  }
}

const mapStateToProps = state => ({
  file: state.files.singleFile
})

const mapDispatchToProps = dispatch => ({
  fetchFile: fileId => dispatch(fetchSingleFile(fileId)),
  updateFile: (fileId, newData) => dispatch(updateFile(fileId, newData))
})

export default connect(mapStateToProps, mapDispatchToProps)(FilePage)
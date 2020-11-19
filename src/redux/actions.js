import { READ_CACHE,

         FETCH_FILES_BEGIN,
         FETCH_FILES_SUCCESS,
         FETCH_FILES_FAIL,
        
         DELETE_FILE_BEGIN,
         DELETE_FILE_SUCCESS,
         DELETE_FILE_FAIL,
        
         UPLOAD_FILE_BEGIN,
         UPLOAD_FILE_SUCCESS,
         UPLOAD_FILE_FAIL,
        
         UPDATE_FILE_BEGIN,
         UPDATE_FILE_SUCCESS,
         UPDATE_FILE_FAIL,

         FETCH_SINGLE_FILE_BEGIN,
         FETCH_SINGLE_FILE_SUCCESS,
         FETCH_SINGLE_FILE_FAIL,
         
         LOGIN_BEGIN,
         LOGIN_SUCCESS,
         LOGIN_FAIL,

         LOGOUT,
         
         REGISTER_BEGIN,
         REGISTER_SUCCESS,
         REGISTER_FAIL,
        
         FETCH_USER_INFO_BEGIN,
         FETCH_USER_INFO_SUCCESS,
         FETCH_USER_INFO_FAIL,
        
         UPDATE_USER_PREFERENCES_BEGIN,
         UPDATE_USER_PREFERENCES_SUCCESS,
         UPDATE_USER_PREFERENCES_FAIL } from './actionTypes'

import axios from 'axios'

axios.defaults.baseURL = '/api'

// FETCH FILES
const fetchFilesBegin = () => ({
  type: FETCH_FILES_BEGIN
})
const fetchFilesSuccess = (files) => ({
  type: FETCH_FILES_SUCCESS,
  payload: {
    files
  }
})
const fetchFilesFail = (error) => ({
  type: FETCH_FILES_FAIL,
  payload: {
    error
  }
})

export const fetchFiles = () => {
  return async dispatch => {
    dispatch(fetchFilesBegin())
    axios.get('/files')
      .then(res => {
        const files = res.data
        dispatch(fetchFilesSuccess(files))
        Promise.resolve()
      })
      .catch(err => {
        dispatch(fetchFilesFail(err))
        Promise.reject(err)
      })
  }
}

// DELETE FILE
const deleteFileBegin = (fileId) => ({
  type: DELETE_FILE_BEGIN,
  payload: {
    fileId: fileId
  }
})
const deleteFileSuccess = (fileId) => ({
  type: DELETE_FILE_SUCCESS,
  payload: {
    fileId: fileId
  }
})
const deleteFileFail = (fileId) => ({
  type: DELETE_FILE_FAIL,
  payload: {
    fileId: fileId
  }
})

export const deleteFile = (fileId) => {
  return async dispatch => {
    dispatch(deleteFileBegin(fileId))
    axios.delete('/files/' + fileId)
      .then(() => {
        dispatch(deleteFileSuccess(fileId))
        Promise.resolve()
      })
      .catch(err => {
        dispatch(deleteFileFail(fileId))
        Promise.reject(err)
      })
  }
}

// UPLOAD FILE
const uploadFileBegin = () => ({
  type: UPLOAD_FILE_BEGIN
})
const uploadFileSuccess = newFile => ({
  type: UPLOAD_FILE_SUCCESS,
  payload: { newFile }
})
const uploadFileFail = () => ({
  type: UPLOAD_FILE_FAIL
})

export const uploadFile = (file) => {
  return async dispatch => {
    dispatch(uploadFileBegin())
    const formData = new FormData()
    formData.append('pdf', file)
    const headers = { 'Content-Type': 'multipart/form-data' }
    axios.post('/files/', formData, { headers })
      .then(res => {
        console.log(res)
        dispatch(uploadFileSuccess(res.data.newFile))
        Promise.resolve()
      })
      .catch(err => {
        dispatch(uploadFileFail())
        Promise.reject(err)
      })
  }
}

// UPDATE FILE
const updateFileBegin = () => ({
  type: UPDATE_FILE_BEGIN
})
const updateFileSuccess = (updatedFile) => ({
  type: UPDATE_FILE_SUCCESS,
  payload: { updatedFile }
})
const updateFileFail = () => ({
  type: UPDATE_FILE_FAIL
})

export const updateFile = (fileId, newData) => {
  return async dispatch => {
    dispatch(updateFileBegin())
    axios.patch('/files/' + fileId, { ...newData })
      .then((res) => {
        dispatch(updateFileSuccess(res.data.updatedFile))
        Promise.resolve()
      })
      .catch(err => {
        dispatch(updateFileFail())
        Promise.reject(err)
      })
  }
}

// FETCH SINGLE FILE
const fetchSingleFileBegin = () => ({
  type: FETCH_SINGLE_FILE_BEGIN
})
const fetchSingleFileSuccess = (fileInfo) => ({
  type: FETCH_SINGLE_FILE_SUCCESS,
  payload: { fileInfo }
})
const fetchSingleFileFail = () => ({
  type: FETCH_SINGLE_FILE_FAIL
})

export const fetchSingleFile = (fileId) => {
  return async dispatch => {
    dispatch(fetchSingleFileBegin())
    axios.get('/files/' + fileId)
      .then(res => {
        dispatch(fetchSingleFileSuccess(res.data.file))
        Promise.resolve()
      })
      .catch(err => {
        dispatch(fetchSingleFileFail())
        Promise.reject(err)
      })
  }
}

export const readCache = () => {
  const token = localStorage.getItem('token')
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  return {
    type: READ_CACHE,
    payload: {
      token
    }
  }
}

// LOGIN
const loginBegin = () => ({
  type: LOGIN_BEGIN
})
const loginSuccess = ({ token }) => {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
  return {
    type: LOGIN_SUCCESS,
    payload: {
      token
    }
  }
}
const loginFail = () => ({
  type: LOGIN_FAIL
})

export const login = (email, password) => {
  return async dispatch => {
    return new Promise((resolve, reject) => {
      dispatch(loginBegin())
      
        const requestOptions = {
          validateStatus: status => (
            [200, 400, 500].includes(status)
          )
        }
        axios.post('/auth/login', { email, password }, requestOptions)
          .then(res => {
            if (res.status === 200) {
              const { token } = res.data
              dispatch(loginSuccess({ token }))
              resolve(res)
            } else {
              reject(res.data.message)
              dispatch(loginFail())
            }
          })
        .catch(err => {
          console.log(err)
          reject()
        })
    })
  }
}

export const logout = () => {
  axios.defaults.headers.common['Authorization'] = ''
  localStorage.removeItem('token');
  return {
    type: LOGOUT
  }
}

const registerBegin = () => ({
  type: REGISTER_BEGIN
})
const registerSuccess = () => ({
  type: REGISTER_SUCCESS
})
const registerFail = () => ({
  type: REGISTER_FAIL
})

export const register = (email, password, firstName) => dispatch => 
  new Promise((resolve, reject) => {
    dispatch(registerBegin())

    const options = {
      validateStatus: status => (
        [201, 500, 409, 400].includes(status)
      )
    }
    axios.post('/auth/register', { email, password, firstName }, options)
      .then(res => {
        if (res.status === 201) {
          dispatch(registerSuccess())
          dispatch(loginSuccess({ token: res.data.token }))
          resolve()
        } else {
          dispatch(registerFail())
          reject(res.data.message ? res.data.message : 'Unknown error')
        }
      })
      .catch(err => {
        console.log(err)
        reject()
      })
})

const fetchUserInfoBegin = () =>({
  type: FETCH_USER_INFO_BEGIN
})
const fetchUserInfoSuccess = ({ firstName, preferences, stats }) =>({
  type: FETCH_USER_INFO_SUCCESS,
  payload: {
    firstName,
    preferences,
    stats
  }
})
const fetchUserInfoFail = () => ({
  type: FETCH_USER_INFO_FAIL
})

export const fetchUserInfo = () => dispatch => 
  new Promise((resolve, reject) => {
    dispatch(fetchUserInfoBegin())
    axios.get('/users')
      .then(res => {
        const { firstName, preferences, stats } = res.data.user
        dispatch(fetchUserInfoSuccess({ firstName, preferences, stats }))
        resolve()
      })
      .catch(err => {
        console.log(err)
        dispatch(fetchUserInfoFail())
        reject()
      })
  })

const updateUserPreferencesBegin = () => ({
  type: UPDATE_USER_PREFERENCES_BEGIN
})
const updateUserPreferencesSuccess = (newPreferences) => ({
  type: UPDATE_USER_PREFERENCES_SUCCESS,
  payload: {
    newPreferences
  }
})
const updateUserPreferencesFail = () => ({
  type: UPDATE_USER_PREFERENCES_FAIL
})

export const updateUserPreferences = (newPreferences) => dispatch => new Promise((resolve, reject) => {
  dispatch(updateUserPreferencesBegin())
  axios.patch('/users/preferences', newPreferences)
    .then((res) =>{
      dispatch(updateUserPreferencesSuccess(res.data.newPreferences))
      resolve()
    })
    .catch(err => {
      dispatch(updateUserPreferencesFail())
      console.log(err)
      reject()
    })
})
import { FETCH_FILES_BEGIN,
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

         //FETCH_SINGLE_FILE_BEGIN,
         FETCH_SINGLE_FILE_SUCCESS,
         /*FETCH_SINGLE_FILE_FAIL*/ } from '../actionTypes'

const initialState = {
  allFiles: [],
  singleFile: {},
  isFetching: false
}

export default (state = initialState, action) => {

  switch (action.type) {
    case FETCH_FILES_BEGIN: {
      return {
        ...state,
        isFetching: true
      }
    }
    case FETCH_FILES_SUCCESS: {
      return {
        ...state,
        allFiles: action.payload.files.reverse(),
        isFetching: false
      }
    }
    case FETCH_FILES_FAIL: {
      return {
        ...state,
        isFetching: false
      }
    }

    case DELETE_FILE_BEGIN: {
      return {
        ...state,
        isFetching: true
      }
    }
    case DELETE_FILE_SUCCESS: {
      return {
        ...state,
        allFiles: state.allFiles.filter(({ niceId }) => niceId !== action.payload.fileId),
        isFetching: false
      }
    }
    case DELETE_FILE_FAIL: {
      return {
        ...state,
        isFetching: false
      }
    }

    case UPLOAD_FILE_BEGIN: {
      return {
        ...state,
        isFetching: true
      }
    }
    case UPLOAD_FILE_SUCCESS: {
      const { allFiles } = state
      allFiles.unshift(action.payload.newFile)

      return {
        ...state,
        allFiles,
        isFetching: false
      }
    }
    case UPLOAD_FILE_FAIL: {
      return {
        ...state,
        isFetching: false
      }
    }
    
    case UPDATE_FILE_BEGIN: {
      return {
        ...state,
        isFetching: true
      }
    }
    case UPDATE_FILE_SUCCESS: {
      const { updatedFile } = action.payload
      const newList = state.allFiles.map((file) => {
        if (file.niceId === updatedFile.niceId) {
          return updatedFile
        } return file
      })
      return {
        ...state,
        allFiles: newList,
        isFetching: false
      }
    }
    case UPDATE_FILE_FAIL: {
      return {
        ...state,
        isFetching: false
      }
    }

    case FETCH_SINGLE_FILE_SUCCESS: {
      return {
        ...state,
        singleFile: action.payload.fileInfo
      }
    }

    default:
      return state
  }
}
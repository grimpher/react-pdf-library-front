import { READ_CACHE,
         LOGOUT,
         LOGIN_SUCCESS,
         FETCH_USER_INFO_SUCCESS,
         UPDATE_USER_PREFERENCES_SUCCESS } from '../actionTypes'

const initialState = {
  token: '',
  firstName: 'Unknown',
  stats: {},
  preferences: {
    dailyGoals: {
      pages: 0,
      minutes: 0
    }
  }
}

export default (state = initialState, action) => {
  switch(action.type) {
    case READ_CACHE: {
      const { token } = action.payload
      localStorage.setItem('token', token)
      return {
        ...state,
        token
      }
    }
    case LOGIN_SUCCESS: {
      const { token } = action.payload
      localStorage.setItem('token', token)
      return {
        ...state,
        token
      }
    }
    case LOGOUT: {
      localStorage.removeItem('token')
      return initialState
    }

    case FETCH_USER_INFO_SUCCESS: {
      const { firstName, preferences, stats } = action.payload
      return {
        ...state,
        firstName,
        preferences,
        stats
      }
    }

    case UPDATE_USER_PREFERENCES_SUCCESS: {
      const { dailyGoals } = action.payload.newPreferences
      return {
        ...state,
        preferences: {
          dailyGoals: {
            pages: dailyGoals.pages,
            minutes: dailyGoals.minutes
          }
        }
      }
    }

    default: {
      return state
    }
  }
}
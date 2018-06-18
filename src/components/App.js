import React from 'react'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'
import {LocaleProvider} from 'antd'
import enUS from 'antd/lib/locale-provider/en_US';

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired,
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          <LocaleProvider locale={enUS}>
            <Router history={browserHistory} children={this.props.routes} />
          </LocaleProvider>
        </div>
      </Provider>
    )
  }
}

export default App

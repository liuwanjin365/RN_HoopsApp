import React, {Component} from 'react'
import {connect} from 'react-redux'

import {Login as _Login} from '../windows'
import {userActions} from '../actions'

class Login extends Component {

  render() {
    return (
      <_Login
        onBack={this.props.onBack}
        onSignIn={this.props.onSignIn}
        onFacebookSignIn={this.props.onFacebookSignIn}
        signInError={this.props.user.signInError}
        onFormEdit={this.props.onFormEdit}
        isLoading={this.props.user.isSigningIn}
      />
    )
  }
}

export default connect(
  (state) => ({
    user: state.user,
  }),
  (dispatch) => ({
    onSignIn: (email, password) => dispatch(userActions.signIn(email, password)),
    onFacebookSignIn: () => dispatch(userActions.facebookSignIn()),
    onFormEdit: () => dispatch(userActions.signInFormEdit()),
  }),
)(Login)

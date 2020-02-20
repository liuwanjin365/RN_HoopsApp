import React, {Component} from 'react'
import {connect} from 'react-redux'

import _PaymentsBankSetup from '../windows/payments-bank-setup'
import {navigationActions, paymentActions} from '../actions'

class PaymentsBankSetup extends Component {

  componentWillUnmount() {
    this.props.onDismissError()
  }

  render() {
    return (
      <_PaymentsBankSetup
        onClose={this.props.onClose}
        onBack={this.props.onBack}
        account={this.props.payments.accountData}
        balance={this.props.payments.accountBalance}
        transactions={this.props.payments.accountTransactions}
        error={this.props.payments.updateAccountError}
        isLoading={this.props.payments.isUpdatingAccount}
        onDonePress={(data) => {
          this.props.onCreateAccount({
            ...data,
            name: this.props.user.name,
            email: this.props.user.email,
            dob: this.props.user.dob,
            uid: this.props.user.uid,
          })
        }}
      />
    )
  }
}

export default connect(
  (state) => ({
    user: state.user,
    payments: state.payments,
  }),
  (dispatch) => ({
    onNavigate: (key, props) => dispatch(navigationActions.push({key, props}, false)),
    onNavigateBack: () => dispatch(navigationActions.pop()),
    onCreateAccount: (data) => dispatch(paymentActions.createAccount(data)),
    onDismissError: () => dispatch(paymentActions.dismissError()),
  }),
)(PaymentsBankSetup)

import React, {Component} from 'react'
import {connect} from 'react-redux'

import _PaymentsAddCard from '../windows/payments-add-card'
import {navigationActions, paymentActions} from '../actions'

class PaymentsAddCard extends Component {

  componentWillUnmount() {
    this.props.onDismissError()
  }

  render() {
    return (
      <_PaymentsAddCard
        onClose={this.props.onClose}
        onBack={this.props.onBack}
        isLoading={this.props.payments.isAddingCard}
        error={this.props.payments.addCardError}
        onDonePress={(data) => {
          this.props.onCreateCard({
            ...data,
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
    onCreateCard: (data) => dispatch(paymentActions.createCard(data)),
    onDismissError: () => dispatch(paymentActions.dismissError()),
  }),
)(PaymentsAddCard)

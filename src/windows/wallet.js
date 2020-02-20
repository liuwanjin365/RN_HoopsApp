import React, {Component} from 'react'
import {ScrollView, View} from 'react-native'

import _ from '../i18n'
import {Header, LoadingAlert, Title} from '../components'
import {UserListInWallet, BankInfoCard} from '../components/wallet'
import {calculateDisplayData} from '../utils'
import StyleSheet from '../styles'

class Wallet extends Component {
  getStripeDisplayError() {
    if (!this.props.account || !this.props.account.verification) {
      return
    }
    const verification = this.props.account.verification
    let error

    switch(verification.disabled_reason) {
      case 'rejected.fraud':
        error = 'This account is rejected due to suspected fraud or illegal activity.'
        break
      case 'rejected.terms_of_service':
        error = 'This account is rejected due to suspected terms of service violations.'
        break
      case 'rejected.listed':
        error = 'This account is rejected due to a match on a third party prohibited persons or companies list (such as financial services provider or government).'
        break
      case 'rejected.other':
        error = 'This account is rejected.'
        break
      case 'fields_needed':
        error = 'Additional verification information is required in order to enable payout or charge capabilities on this account.'
        break
      case 'listed':
        error = 'This account might be a match on a prohibited persons or companies list. We will investigate and either reject or reinstate the account appropriately.'
        break
      case 'other':
        error = 'This account is not rejected but disabled for other reasons.'
        break
    }
    return error
  }

  render() {
    const account = this.props.account
    const onNavigate = this.props.onNavigate

    return (
      <View style={{flex: 1}}>

        <Header title={_('myWallet')} />
        <View style={StyleSheet.padding}>
          <LoadingAlert visible={this.props.isLoading} />

          <View style={{ alignItems: "center"}}>
            <BankInfoCard
              accountData={account}
              onNavigate={onNavigate}
            />
          </View>
        </View>


        <View style={{flex:1}}>
          <Title text={'RECENT TRANSACTIONS'}/>
          <ScrollView>
            {account.transactions && account.transactions.map((transaction, i)=>{
              let displayData = calculateDisplayData(transaction, i)
              return(
                <UserListInWallet
                    key={i}
                    transaction={transaction}
                    displayDate={displayData.displayDate}
                    display={displayData.display}
                    displayStyle={displayData.displayStyle}
                />
              )
            })}

            {/* <View style={StyleSheet.wallet.button}>
              <Button
                type="roundedDefault"
                text={_('viewAll')}
                style={[StyleSheet.singleMargin,]}
              />
            </View> */}
          </ScrollView>

        </View>
      </View>
    )
  }
}

export default Wallet

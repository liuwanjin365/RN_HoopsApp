import React from 'react'
import {View, ScrollView, Text} from 'react-native'

import {AvatarEdit, Button, Header, TextInput, DateInput, Icon, CheckButton} from '../components'
import StyleSheet from '../styles'
import {colors} from '../styles/resources'
import _ from '../i18n'

export default class ProfileEdit extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      image: undefined, // image is a new uploaded image local uri
      imageUrl: props.imageUrl, // imageSrc is a previously uploaded image url
      name: props.name,
      city: props.city,
      gender: props.gender,
      dob: props.dob,
    }
  }

  onPressAddActivity = () => {
    this.props.onPressAddActivity()
  };

  onSavePress = () => {
    this.props.onSavePress({
      image: this.state.image || null,
      name: this.state.name,
      city: this.state.city,
      gender: this.state.gender,
      dob: this.state.dob,
    })
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <Header title={_('profile')} simple />
        <ScrollView contentContainerStyle={StyleSheet.padding}>
          <AvatarEdit
            onChange={(image) => this.setState({image})}
            imageUrl={this.state.image || this.state.imageUrl}
          />

          <Text style={StyleSheet.profile.editLabel}>{_('name')}</Text>
          <TextInput
            value={this.state.name}
            onChangeText={(name) => this.setState({name})}
            type="flat"
            placeholder={_('name')}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.refs.activityInput.focus()
            }}
          />

          <Text style={StyleSheet.profile.editLabel}>{_('city')}</Text>
          <TextInput
            value={this.state.city}
            onChangeText={(city) => this.setState({city})}
            type="flat"
            placeholder={_('city')}
            blurOnSubmit={false}
            onSubmitEditing={() => {
              this.refs.activityInput.focus()
            }}
          />

          <View style={[StyleSheet.buttons.bar, StyleSheet.doubleMargin]}>
            <Button
              type="image"
              icon="male"
              active={this.state.gender === 'male'}
              onPress={() => this.setState({gender: 'male'})}
            />
            <View style={StyleSheet.buttons.separator} />
            <Button
              type="image"
              icon="female"
              active={this.state.gender === 'female'}
              onPress={() => this.setState({gender: 'female'})}
            />
          </View>

          <Text style={StyleSheet.profile.editLabel}>{_('dob')}</Text>
          <DateInput
            type="flat"
            ref="dob"
            rightBar={<Icon name="listIndicator" />}
            barStyle={{position: 'absolute', right: 0, bottom: 0}}
            placeholder={_('dob')}
            icon="nappy"
            date={true}
            time={false}
            value={this.state.dob}
            onChange={(dob) => this.setState({dob})}
          />

          <Text style={[StyleSheet.text, StyleSheet.profile.fieldLabelText]}>
            {_('yourActivities')}
          </Text>

          {this.props.interests.length === 0 ? (
            <Text style={[StyleSheet.noResults, {backgroundColor: colors.window}]}>{_('noActivitiesSelected')}</Text>
          ) : null}

          {this.props.interests && this.props.interests.map((interest, i) =>
            <CheckButton
              key={i}
              type="profileActivity"
              value={true}
              text={<Text>{interest.name} ({interest.level})</Text>}
              icon="minus"
              onChange={() => this.props.onRemoveInterest(interest.id)}
              checkedIconStyle={{backgroundColor: 'transparent' }}
              colorMode="pink"
            />
          )}
          <Button
            type="addActivity"
            text={_('addAnotherActivity')}
            icon="plusGrey"
            onPress={this.onPressAddActivity}
            textStyle={{lineHeight: 20}}

          />
        </ScrollView>

        <View style={StyleSheet.buttons.bar}>
          <Button
            type="dialogDefault"
            text={_('save')}
            onPress={this.onSavePress}
          />
        </View>
      </View>
    )
  }
}

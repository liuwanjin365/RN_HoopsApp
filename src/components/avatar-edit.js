import React, {Component} from 'react'
import {TouchableHighlight, View, Image} from 'react-native'

import {showImagePicker} from '../utils/'
import StyleSheet from '../styles'
import {Icon} from './'

class AvatarEdit extends Component {

  render() {
    return (
      <TouchableHighlight
        onPress={() => showImagePicker(this.props.onChange)}
        style={[StyleSheet.profile.imageContainer, this.props.style]}
      >
        <View style={StyleSheet.profile.imageContainer}>
          {this.props.imageUrl ? (
            <Image
              style={StyleSheet.profile.image}
              source={{uri: this.props.imageUrl}}
            />
          ) : (
            <View style={StyleSheet.profile.image} />
          )}
          <View style={StyleSheet.profile.imageTintOverlay} />
          <Icon style={StyleSheet.profile.imageIconOverlay} name="camera" />
        </View>
      </TouchableHighlight>
    )
  }
}

AvatarEdit.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  imageUrl: React.PropTypes.string,
}

export default AvatarEdit

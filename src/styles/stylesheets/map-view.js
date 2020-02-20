import {colors} from '../resources'

export default StyleSheet => StyleSheet.extend({

  style: {
    flex: 1,
    justifyContent: 'flex-end'
  },

  titleStyle: {
    height: 50,
    backgroundColor: colors.black,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center'
  },

  titleTextStyle: {
    textAlign: 'center',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 13,
    color: colors.white
  },

  titleTextTransform: s => s.toUpperCase(),

  titleIconStyle: {
    position: 'absolute',
    top: 13,
    right: 20
  },

  callOut: {
    flex: 1,
    position: 'relative',
    flexDirection: 'row'
  },

  toolTip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

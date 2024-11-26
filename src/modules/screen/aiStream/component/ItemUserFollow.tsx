import React, { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AvatarImage } from 'src/modules/components/image/AvatarImage';
import { AppText } from 'src/modules/components/text/AppText';
import { TxtTypo } from 'src/shared/helpers/enum';
import { ITheme, useAppTheme } from 'src/shared/theme';

interface IProps {
  name: string,
  numberOfFollow: string
  uri: string
  onFollowBtn?: () => void

}
export const ItemUserFollow = (props: IProps) => {
  const { name, numberOfFollow, uri, onFollowBtn } = props
  const theme = useAppTheme();
  const [follow, setFollow] = useState(false)
  const styles = useStyles(theme, follow);

  return (<View>
    <View style={styles.containerWrapper}>
      <View style={styles.infoWrapper}>
        <AvatarImage size={45} source={{ uri: uri }} />
        <View style={styles.txtInfoWrapper}>
          <AppText typo={TxtTypo.Body_M} style={styles.txtName}>{name}</AppText>
          <AppText typo={TxtTypo.Smallest_R} style={styles.txtNumberOfFollow}>{numberOfFollow} Followers</AppText>
        </View>
      </View>
      <TouchableOpacity style={styles.btnFollow} activeOpacity={0.8} onPress={() => setFollow((prev) => !prev)}>
        <AppText typo={TxtTypo.Smallest_M} style={styles.txtFollow}>{follow ? `Following` : `Follow`}</AppText>
      </TouchableOpacity>
    </View>
    <View style={{ width: '100%', borderWidth: 0.5, borderColor: theme.color.neutral[400] }} />
  </View>
  )
}

const useStyles = (theme: ITheme, follow: boolean) => StyleSheet.create({
  containerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.dimensions.p16,
    paddingVertical: theme.dimensions.p8,
    alignContent: 'center',
    alignItems: 'center',
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txtInfoWrapper: {
    paddingLeft: theme.dimensions.p8
  },
  txtName: {
    color: theme.color.white
  },
  btnFollow: {
    backgroundColor: follow ? theme.color.white : theme.color.primary[700],
    paddingHorizontal: theme.dimensions.p16,
    paddingVertical: theme.dimensions.p6,
    borderRadius: 8,
    alignContent: 'center',
    alignItems: 'center',
    height: theme.dimensions.makeResponsiveSize(30)
  },
  txtNumberOfFollow: {
    color: theme.color.white

  },
  txtFollow: {

  },
})
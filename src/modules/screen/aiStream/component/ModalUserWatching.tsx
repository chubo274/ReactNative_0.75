import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BlurView as BlurViewComm } from '@react-native-community/blur';
import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppBottomSheet } from 'src/modules/components/modalize/AppBottomSheet';
import { ITheme, useAppTheme } from 'src/shared/theme';
import { ItemUserFollow } from './ItemUserFollow';

interface IProps {
  data?: any[]
}

const borderRadiusTop = 30;
export const ModalUserWatching = React.memo(React.forwardRef((props: IProps, ref: React.ForwardedRef<BottomSheet | null>) => {
  const { data } = props;
  const theme = useAppTheme();
  const styles = useStyles(theme);

  const dataAbc = [
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
    { uri: 'https://picsum.photos/200', name: 'ThanhNGuye', numberFollow: '2,2k' },
  ]
  const handleComponent = useCallback(() => {
    return <View style={[{
      alignItems: 'center',
    }, styles.handleStyle]}>
      <View style={{
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: -1,
        borderTopLeftRadius: borderRadiusTop,
        borderTopRightRadius: borderRadiusTop,
        overflow: 'hidden',
      }}>
        <BlurViewComm
          style={{
            flex: 1,
          }}
          blurType="dark"
          blurAmount={5}
          reducedTransparencyFallbackColor="white"
        />
      </View>
      <View style={styles.handleView} />
    </View>
  }, [styles])

  const renderItem = ({ item, index }: { item: any, index: number }) => {
       return <View style={{ paddingHorizontal: theme.dimensions.p24 }}>
      <ItemUserFollow name={item?.name} numberOfFollow={item?.numberFollow} uri={item?.uri} />
    </View>
  }
  return <AppBottomSheet
    ref={ref}
    snapPoints={['60%']}
    backgroundStyle={{ backgroundColor: 'transparent' }}
    handleComponent={handleComponent}>
    <BlurViewComm
      style={{
        zIndex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
      blurType="dark"
      blurAmount={5}
      reducedTransparencyFallbackColor="white"
    />
    <View style={{ zIndex: 2 }}>
      <BottomSheetFlatList
        data={dataAbc}
        // keyExtractor={(item, index) => index}
        renderItem={renderItem}
      />
    </View>
  </AppBottomSheet>
}));

const useStyles = (theme: ITheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleStyle: {
    borderColor: '#FFFFFF60',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopLeftRadius: borderRadiusTop,
    borderTopRightRadius: borderRadiusTop,
  },
  handleView: {
    zIndex: 2,
    width: 60,
    height: 8,
    backgroundColor: '#CBD5E1',
    borderRadius: 8,
    marginTop: theme.dimensions.p8,
  },
})
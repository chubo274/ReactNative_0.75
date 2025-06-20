import { File, FileLock } from "phosphor-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "src/modules/components/text/AppText";
import { ITheme } from "src/shared/theme";

export const OtherContentScreen = React.memo(() => {
    return (
        <ScrollView>
            <AppText>Tiện ích</AppText>
            
            <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between', paddingHorizontal: 10}}>
                <TouchableOpacity activeOpacity={0.8} style={{flex: 1, backgroundColor: 'white', height: 70, borderRadius: 10, padding: 5}}>
                    <File size={32} color="#cd853f" weight="light" />
                    <AppText>Lịch sử đơn hàng</AppText>
                </TouchableOpacity>

                <View style={{width: 5}} />

                <TouchableOpacity activeOpacity={0.8} style={{flex: 1, backgroundColor: 'white', height: 70, borderRadius: 10, padding: 5}}>
                    <FileLock size={32} color="#663399" weight="light" />
                    <AppText>Điều khoản</AppText>
                </TouchableOpacity>
            </View>

            <View style={{height: 5}} />

            <View style={{paddingHorizontal: 10}}>
                <TouchableOpacity activeOpacity={0.8} style={{ backgroundColor: 'white', height: 70, borderRadius: 10, padding: 5}}>
                    <FileLock size={32} color="#663399" weight="light" />
                    <AppText>Điều khoản VNPay</AppText>
                </TouchableOpacity>
            </View>

            <View style={{height: 15}} />
            
            <AppText>Hỗ trợ</AppText>
        </ScrollView>
    );
});

const useStyles = (theme: ITheme) => StyleSheet.create({
  
});
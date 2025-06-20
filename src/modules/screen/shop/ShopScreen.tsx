import React from "react";
import { StyleSheet } from "react-native";
import { AppText } from "src/modules/components/text/AppText";
import { ITheme } from "src/shared/theme";

export const ShopScreen = React.memo(() => {
    return (
        <>
            <AppText>ShopScreen</AppText>
        </>
    );
});

const useStyles = (theme: ITheme) => StyleSheet.create({
  
});
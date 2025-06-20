import React from "react";
import { StyleSheet } from "react-native";
import { AppText } from "src/modules/components/text/AppText";
import { ITheme } from "src/shared/theme";

export const IncentivesScreen = React.memo(() => {
    return (
        <>
            <AppText>IncentivesScreen</AppText>
        </>
    );
});

const useStyles = (theme: ITheme) => StyleSheet.create({
  
});
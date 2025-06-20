export interface IAppColor {
    navigation: {
        navigationBackgroundColor: string,
        navigationTintColor: string,

        tabbarBackgroundColor: string,
        tabbarActiveColor: string,
        tabbarInactiveColor: string,
    },
    bg: {
        disable: string;
        white: string;
        primary: string;
    },
    textColor: {
        primary: string;
        secondary: string;
        disable: string;
        white: string;
        link: string;
        subText: string;
    };
    stroke: string,
    neutral: {
        50: string,
        100: string,
        200: string,
        300: string,
        400: string,
        500: string,
        600: string,
        700: string,
        800: string,
        900: string,
    },
}

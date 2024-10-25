import 'i18next';
import vi from './resources/vi';

declare module 'i18next' {
    // and extend them!
    interface CustomTypeOptions {
        // custom namespace type if you changed it
        defaultNS: 'translation';
        // custom resources type
        resources: {
            translation: typeof vi;
        };
    }
}

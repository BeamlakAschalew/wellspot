import { usePage } from '@inertiajs/react';

const translations = {
    en: {
        'app.title': 'WellSpot',
        'nav.discover': 'Discover',
        'nav.howItWorks': 'How it Works',
        'nav.forProviders': 'For Providers',
        'nav.switchToAmharic': 'Switch to Amharic',
        'nav.switchToEnglish': 'Switch to English',
        'home.metaTitle': 'WellSpot | Find Your Balance',
        'home.hero.imageAlt':
            'A serene wellness studio interior with natural sunlight, oak flooring, and lush indoor plants.',
        'home.hero.title': 'Find your balance',
        'home.hero.body':
            'Discover local wellness providers with active services, real categories, and community ratings.',
        'home.search.service': 'Service',
        'home.search.servicePlaceholder': 'Massage, yoga, therapy...',
        'home.search.location': 'Location',
        'home.search.locationPlaceholder': 'Bole, Kazanchis...',
        'home.search.category': 'Category',
        'home.search.allCategories': 'All categories',
        'home.search.submit': 'Search providers',
        'home.categories.title': 'Explore Categories',
        'home.categories.body':
            'Browse live categories with published providers ready to book.',
        'home.categories.clear': 'Clear category',
        'home.categories.providers': '{count} providers',
        'home.providers.matching': 'Matching Providers',
        'home.providers.topRated': 'Top Rated Providers',
        'home.providers.matchCount':
            '{count} published {providerLabel} match your search.',
        'home.providers.rankBody':
            'Published providers ranked by real customer reviews.',
        'home.providers.clearSearch': 'Clear search',
        'home.providers.noneTitle': 'No providers found',
        'home.providers.noneBody':
            'Try a broader service, another neighborhood, or clear the selected category.',
        'home.provider.new': 'New',
        'home.provider.featured': 'Featured',
        'home.provider.wellness': 'Wellness',
        'home.provider.reviews': '{count} reviews',
        'home.price.ask': 'Ask',
        'home.how.title': 'How WellSpot Works',
        'home.how.body':
            'Wellness made simple. Find and book your favorite services in three easy steps.',
        'home.step.search.title': '1. Search',
        'home.step.search.body':
            'Filter by service, location, or provider to find your perfect match.',
        'home.step.book.title': '2. Book',
        'home.step.book.body':
            'Check availability and send your booking request instantly.',
        'home.step.relax.title': '3. Relax',
        'home.step.relax.body':
            'Arrive at your appointment and let the professionals handle the rest.',
        'home.community.title': 'Our Community',
        'home.community.body':
            'Join people who found their wellness routine through WellSpot.',
        'home.cta.title': 'Ready to feel better?',
        'home.cta.body':
            'Start with a search, or create a provider account and list your services.',
        'home.cta.findProvider': 'Find a Provider',
        'home.cta.listService': 'List Your Service',
        'footer.tagline':
            'Your personal gateway to professional wellness and holistic health services.',
        'footer.services': 'Services',
        'footer.company': 'Company',
        'footer.follow': 'Follow Us',
        'footer.about': 'About Us',
        'footer.privacy': 'Privacy Policy',
        'footer.contact': 'Contact',
        'footer.rights': '© 2024 WellSpot. All rights reserved.',
        'service.massage': 'Massage',
        'service.yoga': 'Yoga',
        'service.therapy': 'Therapy',
        'service.spa': 'Spa',
        'quiz.metaTitle': 'AI Wellness Quiz - WellSpot',
        'quiz.nav.discover': 'Discover',
        'quiz.nav.schedule': 'Schedule',
        'quiz.nav.insights': 'Insights',
        'quiz.sidebar.dashboard': 'Dashboard',
        'quiz.sidebar.quiz': 'Wellness Quiz',
        'quiz.sidebar.bookings': 'Bookings',
        'quiz.sidebar.progress': 'Progress',
        'quiz.sidebar.settings': 'Settings',
        'quiz.sidebar.ready': 'Ready for your check-in?',
        'quiz.sidebar.bookSession': 'Book Session',
        'quiz.question.count': 'Question 3 of 10',
        'quiz.question.complete': '30% Complete',
        'quiz.question.imageAlt':
            'A serene bedroom at dusk with soft ambient lighting and plush bedding.',
        'quiz.question.title':
            'How would you rate your sleep quality over the last week?',
        'quiz.question.body':
            'Select the option that best describes your typical nightly rest.',
        'quiz.option.excellent.title': 'Excellent',
        'quiz.option.excellent.body':
            '8+ hours of restful, uninterrupted sleep.',
        'quiz.option.good.title': 'Good',
        'quiz.option.good.body': '6-8 hours with minimal waking.',
        'quiz.option.fair.title': 'Fair',
        'quiz.option.fair.body': '4-6 hours or frequent disturbances.',
        'quiz.option.poor.title': 'Poor',
        'quiz.option.poor.body': 'Less than 4 hours or extremely restless.',
        'quiz.previous': 'Previous',
        'quiz.next': 'Next',
        'quiz.secure': 'Your data is secure',
        'quiz.duration': 'Takes ~5 minutes',
        'quiz.mobile.explore': 'Explore',
        'quiz.mobile.quizzes': 'Quizzes',
        'quiz.mobile.tracking': 'Tracking',
        'quiz.mobile.profile': 'Profile',
        'footer.aboutShort': 'About',
        'footer.terms': 'Terms of Service',
        'footer.marketplaceRights':
            '© 2024 WellSpot Marketplace. All rights wellness.',
        'auth.login.title': 'Log in',
        'auth.login.heading': 'Log in to your account',
        'auth.login.description':
            'Enter your email and password below to log in',
        'auth.email': 'Email address',
        'auth.emailShort': 'Email',
        'auth.password': 'Password',
        'auth.forgotPassword': 'Forgot your password?',
        'auth.remember': 'Remember me',
        'auth.noAccount': "Don't have an account?",
        'auth.signUp': 'Sign up',
        'auth.register.title': 'Register',
        'auth.register.heading': 'Create an account',
        'auth.register.description':
            'Enter your details below to create your account',
        'auth.name': 'Name',
        'auth.fullName': 'Full name',
        'auth.confirmPassword': 'Confirm password',
        'auth.createAccount': 'Create account',
        'auth.hasAccount': 'Already have an account?',
        'auth.forgot.title': 'Forgot password',
        'auth.forgot.description':
            'Enter your email to receive a password reset link',
        'auth.emailResetLink': 'Email password reset link',
        'auth.returnTo': 'Or, return to',
        'auth.reset.title': 'Reset password',
        'auth.reset.description': 'Please enter your new password below',
        'auth.reset.submit': 'Reset password',
        'auth.confirm.title': 'Confirm password',
        'auth.confirm.description':
            'This is a secure area of the application. Please confirm your password before continuing.',
        'auth.confirm.submit': 'Confirm password',
        'settings.title': 'Settings',
        'settings.description': 'Manage your profile and account settings',
        'settings.profile': 'Profile',
        'settings.security': 'Security',
        'settings.appearance': 'Appearance',
        'settings.profileTitle': 'Profile settings',
        'settings.profileHeading': 'Profile',
        'settings.profileDescription': 'Update your name and email address',
        'settings.save': 'Save',
        'settings.securityTitle': 'Security settings',
        'settings.updatePassword': 'Update password',
        'settings.securityDescription':
            'Ensure your account is using a long, random password to stay secure',
        'settings.currentPassword': 'Current password',
        'settings.newPassword': 'New password',
        'settings.appearanceTitle': 'Appearance settings',
        'settings.appearanceDescription':
            'Update the appearance settings for your account',
        'settings.light': 'Light',
        'settings.dark': 'Dark',
        'settings.system': 'System',
        'settings.deleteAccount': 'Delete account',
        'settings.deleteDescription':
            'Delete your account and all of its resources',
        'settings.warning': 'Warning',
        'settings.warningBody':
            'Please proceed with caution, this cannot be undone.',
        'settings.deleteConfirmTitle':
            'Are you sure you want to delete your account?',
        'settings.deleteConfirmBody':
            'Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
        'settings.cancel': 'Cancel',
    },
    am: {
        'app.title': 'ዌልስፖት',
        'nav.discover': 'ያግኙ',
        'nav.howItWorks': 'እንዴት ይሰራል',
        'nav.forProviders': 'ለአገልግሎት ሰጪዎች',
        'nav.switchToAmharic': 'ወደ አማርኛ ቀይር',
        'nav.switchToEnglish': 'ወደ እንግሊዝኛ ቀይር',
        'home.metaTitle': 'ዌልስፖት | ሚዛንዎን ያግኙ',
        'home.hero.imageAlt':
            'በተፈጥሯዊ ብርሃን፣ በኦክ ወለል እና በአረንጓዴ ዕፅዋት የተሞላ ጸጥተኛ የዌልነስ ስቱዲዮ።',
        'home.hero.title': 'ሚዛንዎን ያግኙ',
        'home.hero.body':
            'ንቁ አገልግሎቶች፣ ትክክለኛ ምድቦች እና የማህበረሰብ ደረጃዎች ያላቸውን የአካባቢ ዌልነስ አቅራቢዎች ያግኙ።',
        'home.search.service': 'አገልግሎት',
        'home.search.servicePlaceholder': 'ማሳጅ፣ ዮጋ፣ ቴራፒ...',
        'home.search.location': 'አካባቢ',
        'home.search.locationPlaceholder': 'ቦሌ፣ ካዛንቺስ...',
        'home.search.category': 'ምድብ',
        'home.search.allCategories': 'ሁሉም ምድቦች',
        'home.search.submit': 'አቅራቢዎችን ፈልግ',
        'home.categories.title': 'ምድቦችን ያስሱ',
        'home.categories.body': 'ለመያዝ ዝግጁ የሆኑ የታተሙ አቅራቢዎች ያላቸውን ንቁ ምድቦች ያስሱ።',
        'home.categories.clear': 'ምድብ አጽዳ',
        'home.categories.providers': '{count} አቅራቢዎች',
        'home.providers.matching': 'ተዛማጅ አቅራቢዎች',
        'home.providers.topRated': 'ከፍተኛ ደረጃ ያላቸው አቅራቢዎች',
        'home.providers.matchCount':
            '{count} የታተመ {providerLabel} ከፍለጋዎ ጋር ይዛመዳል።',
        'home.providers.rankBody': 'በእውነተኛ የደንበኞች ግምገማዎች የተደረደሩ የታተሙ አቅራቢዎች።',
        'home.providers.clearSearch': 'ፍለጋ አጽዳ',
        'home.providers.noneTitle': 'ምንም አቅራቢ አልተገኘም',
        'home.providers.noneBody':
            'የበለጠ ሰፊ አገልግሎት፣ ሌላ አካባቢ ወይም የተመረጠውን ምድብ ማጽዳት ይሞክሩ።',
        'home.provider.new': 'አዲስ',
        'home.provider.featured': 'ተለይቶ የቀረበ',
        'home.provider.wellness': 'ዌልነስ',
        'home.provider.reviews': '{count} ግምገማዎች',
        'home.price.ask': 'ይጠይቁ',
        'home.how.title': 'ዌልስፖት እንዴት ይሰራል',
        'home.how.body':
            'ዌልነስን ቀላል አድርገናል። የሚወዷቸውን አገልግሎቶች በሶስት ቀላል ደረጃዎች ያግኙ እና ያስይዙ።',
        'home.step.search.title': '1. ፈልግ',
        'home.step.search.body':
            'ትክክለኛውን ምርጫዎን ለማግኘት በአገልግሎት፣ በአካባቢ ወይም በአቅራቢ ያጣሩ።',
        'home.step.book.title': '2. ያስይዙ',
        'home.step.book.body': 'ተገኝነትን ይመልከቱ እና የቦታ ማስያዣ ጥያቄዎን ወዲያውኑ ይላኩ።',
        'home.step.relax.title': '3. ይዝናኑ',
        'home.step.relax.body': 'ወደ ቀጠሮዎ ይድረሱ፣ ባለሙያዎቹም ቀሪውን ይከናውኑ።',
        'home.community.title': 'ማህበረሰባችን',
        'home.community.body': 'በዌልስፖት የዌልነስ ልማዳቸውን ያገኙ ሰዎችን ይቀላቀሉ።',
        'home.cta.title': 'የተሻለ ስሜት ለመጀመር ዝግጁ ነዎት?',
        'home.cta.body': 'በፍለጋ ይጀምሩ፣ ወይም የአቅራቢ መለያ ይፍጠሩ እና አገልግሎቶችዎን ይዘርዝሩ።',
        'home.cta.findProvider': 'አቅራቢ ፈልግ',
        'home.cta.listService': 'አገልግሎትዎን ይዘርዝሩ',
        'footer.tagline': 'ወደ ሙያዊ ዌልነስ እና የሁለንተናዊ ጤና አገልግሎቶች የግል መግቢያዎ።',
        'footer.services': 'አገልግሎቶች',
        'footer.company': 'ኩባንያ',
        'footer.follow': 'ይከተሉን',
        'footer.about': 'ስለ እኛ',
        'footer.privacy': 'የግላዊነት ፖሊሲ',
        'footer.contact': 'አግኙን',
        'footer.rights': '© 2024 ዌልስፖት። መብቶች በሙሉ የተጠበቁ ናቸው።',
        'service.massage': 'ማሳጅ',
        'service.yoga': 'ዮጋ',
        'service.therapy': 'ቴራፒ',
        'service.spa': 'ስፓ',
        'quiz.metaTitle': 'የAI ዌልነስ ጥያቄ - ዌልስፖት',
        'quiz.nav.discover': 'ያግኙ',
        'quiz.nav.schedule': 'መርሐግብር',
        'quiz.nav.insights': 'ግንዛቤዎች',
        'quiz.sidebar.dashboard': 'ዳሽቦርድ',
        'quiz.sidebar.quiz': 'የዌልነስ ጥያቄ',
        'quiz.sidebar.bookings': 'ቦታ ማስያዣዎች',
        'quiz.sidebar.progress': 'እድገት',
        'quiz.sidebar.settings': 'ቅንብሮች',
        'quiz.sidebar.ready': 'ለዛሬው ምርመራ ዝግጁ ነዎት?',
        'quiz.sidebar.bookSession': 'ክፍለ ጊዜ ያስይዙ',
        'quiz.question.count': 'ጥያቄ 3 ከ 10',
        'quiz.question.complete': '30% ተጠናቋል',
        'quiz.question.imageAlt': 'በምሽት ለስላሳ ብርሃን እና ምቹ መኝታ ያለው ጸጥተኛ መኝታ ቤት።',
        'quiz.question.title': 'ባለፈው ሳምንት የእንቅልፍዎን ጥራት እንዴት ይገመግማሉ?',
        'quiz.question.body': 'የተለመደውን የሌሊት እረፍትዎን በተሻለ የሚገልጸውን አማራጭ ይምረጡ።',
        'quiz.option.excellent.title': 'እጅግ ጥሩ',
        'quiz.option.excellent.body': '8+ ሰዓት የሚያረፍ፣ ያልተቋረጠ እንቅልፍ።',
        'quiz.option.good.title': 'ጥሩ',
        'quiz.option.good.body': '6-8 ሰዓት በትንሽ መንቃት።',
        'quiz.option.fair.title': 'መካከለኛ',
        'quiz.option.fair.body': '4-6 ሰዓት ወይም ተደጋጋሚ መረበሽ።',
        'quiz.option.poor.title': 'ደካማ',
        'quiz.option.poor.body': 'ከ4 ሰዓት በታች ወይም በጣም የተረበሸ።',
        'quiz.previous': 'ቀዳሚ',
        'quiz.next': 'ቀጣይ',
        'quiz.secure': 'መረጃዎ ደህንነቱ የተጠበቀ ነው',
        'quiz.duration': '~5 ደቂቃ ይወስዳል',
        'quiz.mobile.explore': 'ያስሱ',
        'quiz.mobile.quizzes': 'ጥያቄዎች',
        'quiz.mobile.tracking': 'ክትትል',
        'quiz.mobile.profile': 'መገለጫ',
        'footer.aboutShort': 'ስለ እኛ',
        'footer.terms': 'የአገልግሎት ውሎች',
        'footer.marketplaceRights':
            '© 2024 ዌልስፖት ገበያ። ሁሉም የዌልነስ መብቶች የተጠበቁ ናቸው።',
        'auth.login.title': 'ግባ',
        'auth.login.heading': 'ወደ መለያዎ ይግቡ',
        'auth.login.description': 'ለመግባት ኢሜይልዎን እና የይለፍ ቃልዎን ያስገቡ',
        'auth.email': 'የኢሜይል አድራሻ',
        'auth.emailShort': 'ኢሜይል',
        'auth.password': 'የይለፍ ቃል',
        'auth.forgotPassword': 'የይለፍ ቃልዎን ረሱ?',
        'auth.remember': 'አስታውሰኝ',
        'auth.noAccount': 'መለያ የለዎትም?',
        'auth.signUp': 'ይመዝገቡ',
        'auth.register.title': 'ይመዝገቡ',
        'auth.register.heading': 'መለያ ይፍጠሩ',
        'auth.register.description': 'መለያዎን ለመፍጠር ዝርዝሮችዎን ያስገቡ',
        'auth.name': 'ስም',
        'auth.fullName': 'ሙሉ ስም',
        'auth.confirmPassword': 'የይለፍ ቃል ያረጋግጡ',
        'auth.createAccount': 'መለያ ፍጠር',
        'auth.hasAccount': 'መለያ አለዎት?',
        'auth.forgot.title': 'የይለፍ ቃል ረሱ',
        'auth.forgot.description': 'የይለፍ ቃል መቀየሪያ አገናኝ ለመቀበል ኢሜይልዎን ያስገቡ',
        'auth.emailResetLink': 'የይለፍ ቃል መቀየሪያ አገናኝ በኢሜይል ላክ',
        'auth.returnTo': 'ወይም ተመለስ ወደ',
        'auth.reset.title': 'የይለፍ ቃል ዳግም አስጀምር',
        'auth.reset.description': 'እባክዎ አዲሱን የይለፍ ቃልዎን ከታች ያስገቡ',
        'auth.reset.submit': 'የይለፍ ቃል ዳግም አስጀምር',
        'auth.confirm.title': 'የይለፍ ቃል ያረጋግጡ',
        'auth.confirm.description':
            'ይህ የመተግበሪያው ደህንነቱ የተጠበቀ ክፍል ነው። ከመቀጠልዎ በፊት እባክዎ የይለፍ ቃልዎን ያረጋግጡ።',
        'auth.confirm.submit': 'የይለፍ ቃል ያረጋግጡ',
        'settings.title': 'ቅንብሮች',
        'settings.description': 'መገለጫዎን እና የመለያ ቅንብሮችዎን ያስተዳድሩ',
        'settings.profile': 'መገለጫ',
        'settings.security': 'ደህንነት',
        'settings.appearance': 'መልክ',
        'settings.profileTitle': 'የመገለጫ ቅንብሮች',
        'settings.profileHeading': 'መገለጫ',
        'settings.profileDescription': 'ስምዎን እና የኢሜይል አድራሻዎን ያዘምኑ',
        'settings.save': 'አስቀምጥ',
        'settings.securityTitle': 'የደህንነት ቅንብሮች',
        'settings.updatePassword': 'የይለፍ ቃል አዘምን',
        'settings.securityDescription':
            'መለያዎ ደህንነቱን ለመጠበቅ ረጅም እና ድንገተኛ የይለፍ ቃል እየተጠቀመ መሆኑን ያረጋግጡ',
        'settings.currentPassword': 'የአሁኑ የይለፍ ቃል',
        'settings.newPassword': 'አዲስ የይለፍ ቃል',
        'settings.appearanceTitle': 'የመልክ ቅንብሮች',
        'settings.appearanceDescription': 'ለመለያዎ የመልክ ቅንብሮችን ያዘምኑ',
        'settings.light': 'ብርሃን',
        'settings.dark': 'ጨለማ',
        'settings.system': 'ስርዓት',
        'settings.deleteAccount': 'መለያ ሰርዝ',
        'settings.deleteDescription': 'መለያዎን እና ሁሉንም ሀብቶቹን ይሰርዙ',
        'settings.warning': 'ማስጠንቀቂያ',
        'settings.warningBody': 'እባክዎ በጥንቃቄ ይቀጥሉ፣ ይህ ሊመለስ አይችልም።',
        'settings.deleteConfirmTitle': 'መለያዎን መሰረዝ እርግጠኛ ነዎት?',
        'settings.deleteConfirmBody':
            'መለያዎ ከተሰረዘ በኋላ ሁሉም ሀብቶቹ እና መረጃው በቋሚነት ይሰረዛሉ። መለያዎን በቋሚነት መሰረዝ እንደሚፈልጉ ለማረጋገጥ እባክዎ የይለፍ ቃልዎን ያስገቡ።',
        'settings.cancel': 'ሰርዝ',
    },
} as const;

export type TranslationKey = keyof typeof translations.en;

type Replacements = Record<string, string | number>;

function interpolate(value: string, replacements?: Replacements): string {
    if (!replacements) {
        return value;
    }

    return Object.entries(replacements).reduce(
        (translation, [key, replacement]) =>
            translation.replaceAll(`{${key}}`, String(replacement)),
        value,
    );
}

export function translate(
    key: TranslationKey,
    locale: string,
    replacements?: Replacements,
): string {
    const messages =
        translations[locale as keyof typeof translations] ?? translations.en;

    return interpolate(messages[key] ?? translations.en[key], replacements);
}

export function isTranslationKey(value: string): value is TranslationKey {
    return value in translations.en;
}

export function translateMaybe(value: string | undefined, locale: string) {
    if (!value || !isTranslationKey(value)) {
        return value;
    }

    return translate(value, locale);
}

export function useTranslation() {
    const { locale } = usePage().props;
    const activeLocale = typeof locale === 'string' ? locale : 'en';

    return {
        locale: activeLocale,
        t: (key: TranslationKey, replacements?: Replacements) =>
            translate(key, activeLocale, replacements),
    };
}

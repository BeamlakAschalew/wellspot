import ResponseCard from '@/components/quiz/response';
import WellSpotFooter from '@/components/user/footerSmall';
import { Header } from '@/components/user/header';

export default function Response() {
    return (
        <div>
            <Header />
            <ResponseCard />
            <WellSpotFooter />
        </div>
    );
}

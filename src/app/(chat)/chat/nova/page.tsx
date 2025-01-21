import TalkWithNovaView from "./view";
import {metatag} from "@/lib/metatag";

const TalkWithNovaPage = () => {
    return <TalkWithNovaView />
};

export default TalkWithNovaPage;

export const generateMetadata = () => {
    return metatag({
        pageTitle: "Talk With Nova | PRAS Samin",
        robots: "noindex, nofollow",
    })
}
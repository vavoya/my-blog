import ProtectedContent from "@/app/register/protectedContent";
import {redirects} from "@/lib/redirects";

type SearchParams = Promise<{
    redirectTo: string | undefined;
}>
export default async function ProtectedPage({ searchParams }: { searchParams: SearchParams }) {
    const { redirectTo } = await searchParams;
    await redirects('/register', redirectTo ?? '')



    return <ProtectedContent />
}
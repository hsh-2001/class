import SButton from "@/components/ui/SButton";
import useAthentication from "@/hooks/useAthentication";

export default function Profile() {
    const {
        handleLogout,
    } = useAthentication();
    return (
        <div className="w-full h-full page-body">
            <h1>Profile</h1>

            <div>
                <SButton type="button" color="danger" onClick={handleLogout}>Logout</SButton>
            </div>
        </div>
    )
}
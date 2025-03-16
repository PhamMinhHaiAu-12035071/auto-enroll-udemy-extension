import React from "react";
import AppButton from "../../components/AppButton/AppButton";
import CardWarning from "../../components/CardWarning/CardWarning";
import Header from "../../components/Header";
import WavingCharacters from "../../components/WavingCharacters/WavingCharacters";
import { BottomTab, NavigationParams, Screen } from "../../models/PersistentRouterModel";

interface AddCoursePageProps {
    navigateTo: (screen: Screen, params?: NavigationParams) => void;
    setActiveBottomTab: (tab: BottomTab) => void;
}

const AddCoursePage: React.FC<AddCoursePageProps> = ({ navigateTo, setActiveBottomTab }) => {
    const handleAddCourse = () => {
        // Ví dụ truyền params khi chuyển màn hình
        navigateTo(Screen.HOME, {
            fromScreen: Screen.ADD_COURSE,
        });
        setActiveBottomTab(BottomTab.HISTORY);
    };

    return (
        <div className="relative h-[var(--popup-height)] w-[var(--popup-width)] bg-base flex flex-col">
            <Header title="Add Course Auto Enroll" isShowIcon={false} />

            <main className="flex-1 h-0 flex flex-col items-center justify-between py-4">
                <div className="w-80 h-64">
                    <WavingCharacters />
                </div>
                <div className="px-3">
                    <CardWarning
                        title="Warning"
                        message="Please make sure that you are logged in to your Udemy account."
                    />
                </div>
                <AppButton
                    text="Add Tan's course"
                    backgroundColor="var(--color-yellow)"
                    shadowColor="hsl(0deg 0% 7.5%)"
                    borderColor="hsl(0deg 0% 24%)"
                    borderRadius={20}
                    onClick={handleAddCourse}
                />
            </main>
        </div>
    );
}

export default AddCoursePage;
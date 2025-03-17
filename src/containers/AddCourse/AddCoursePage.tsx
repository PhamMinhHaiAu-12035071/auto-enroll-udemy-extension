import React, { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import AppButton from "../../components/AppButton/AppButton";
import CardWarning from "../../components/CardWarning/CardWarning";
import Header from "../../components/Header";
import WavingCharacters from "../../components/WavingCharacters/WavingCharacters";
import { BottomTab, NavigationParams, Screen } from "../../models/PersistentRouterModel";
import { CacheSessionService, SESSION_CACHE_KEYS } from "../../services/cache/cache_session_service";

interface AddCoursePageProps {
    navigateTo: (screen: Screen, params?: NavigationParams) => void;
    setActiveBottomTab: (tab: BottomTab) => void;
}

const steps = [
    {
        target: '.add-course-btn',
        content: (
            <div className="text-center font-craft">
                <p className="mb-2 font-craft">Click <strong>just once 😎</strong> to automatically add all Tan's courses to your Udemy account!</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">The system will handle everything 🥰</p>
                <p className="text-sm text-primary-dark font-craft-demi"><strong>No additional action required 😝</strong>.</p>
            </div>
        ),
        disableBeacon: true,
        styles: {
            spotlight: {
                padding: 12,
                borderRadius: 24,
            },
            options: {
                primaryColor: '#f04',
                spotlightClicks: false,
            }
        },
    },
];



const AddCoursePage: React.FC<AddCoursePageProps> = ({ navigateTo, setActiveBottomTab }) => {
    // Default to true and update after checking cache
    const [runTour, setRunTour] = useState(false);
    // Add loading state to prevent tour from flashing
    const [isLoading, setIsLoading] = useState(true);

    // Load tour state from cache session
    useEffect(() => {
        const checkTourState = async () => {
            const tourCompleted = await CacheSessionService.get<boolean>(SESSION_CACHE_KEYS.TOUR_ADD_COURSE);
            setRunTour(!tourCompleted);
            setIsLoading(false);
        };

        checkTourState();
    }, []);

    const handleAddCourse = () => {
        navigateTo(Screen.HOME, {
            fromScreen: Screen.ADD_COURSE,
        });
        setActiveBottomTab(BottomTab.HISTORY);
    };

    // Handle tour events
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            // Save tour completion status to cache session
            CacheSessionService.set(SESSION_CACHE_KEYS.TOUR_ADD_COURSE, true);
            setRunTour(false);
        }
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
                    className="add-course-btn"
                    text="Add Tan's course"
                    backgroundColor="var(--color-yellow)"
                    shadowColor="hsl(0deg 0% 7.5%)"
                    borderColor="hsl(0deg 0% 24%)"
                    borderRadius={20}
                    onClick={handleAddCourse}
                />
            </main>

            {!isLoading && (
                <Joyride
                    run={runTour}
                    steps={steps}
                    callback={handleJoyrideCallback}
                    continuous={false}
                    showSkipButton={true}
                    styles={{
                        options: {
                            arrowColor: '#e3ffeb',
                            backgroundColor: '#e3ffeb',
                            overlayColor: 'rgba(79, 26, 0, 0.4)',
                            primaryColor: '#000',
                            textColor: '#004a14',
                            zIndex: 1000,
                        },
                    }}
                />
            )}
        </div>
    );
}

export default AddCoursePage;
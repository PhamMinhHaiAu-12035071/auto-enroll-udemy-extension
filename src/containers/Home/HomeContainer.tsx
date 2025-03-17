import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { useStore } from "../../hooks/useStore";
import { BackgroundStatus, HistoryStep } from "../../models/HistoryModel";
import { NavigationParams, Screen } from "../../models/PersistentRouterModel";
import { CacheSessionService, SESSION_CACHE_KEYS } from "../../services/cache/cache_session_service";
import Home from "./Home";

interface HomeContainerProps {
    navigateTo: (screen: Screen, params?: NavigationParams) => void;
}

// Move steps definitions here
const bottomBarSteps = [
    {
        target: '.History',
        content: (
            <div className="text-center font-craft">
                <p className="mb-2">📊 The <strong>History tab</strong> shows you the step-by-step progress of the system!</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">📝 Track exactly how courses are being automatically added to your account.</p>
                <p className="text-sm text-primary-dark font-craft-demi"><strong>🔄 Real-time updates as each step completes successfully!</strong></p>
            </div>
        ),
        disableBeacon: true,
        styles: {
            spotlight: {
                padding: 0,
                borderRadius: 48,
            },
            options: {
                primaryColor: '#f04',
                spotlightClicks: false,
            }
        },
    },
    {
        target: '.Course',
        content: (
            <div className="text-center font-craft">
                <p className="mb-2">📚 The <strong>Course tab</strong> displays detailed information about your enrolled courses!</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">👨‍🎓 See all the courses you've successfully enrolled in.</p>
                <p className="text-sm text-primary-dark font-craft-demi"><strong>📋 View course titles, instructors, and more!</strong></p>
            </div>
        ),
        disableBeacon: true,
        styles: {
            spotlight: {
                padding: 0,
                width: 48,
                height: 48,
                borderRadius: 48,
            },
            options: {
                primaryColor: '#f04',
                spotlightClicks: false,
            }
        },
    },
    {
        target: '.Analysis',
        content: (
            <div className="text-center font-craft">
                <p className="mb-2">📈 The <strong>Analysis tab</strong> provides detailed enrollment statistics!</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">✅ Track successfully enrolled courses.</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">⏰ See which courses couldn't be enrolled due to expiration.</p>
                <p className="text-sm text-primary-dark font-craft-demi"><strong>🔍 Get comprehensive reports on all enrollment attempts!</strong></p>
            </div>
        ),
        disableBeacon: true,
        styles: {
            spotlight: {
                padding: 0,
                borderRadius: 48,
            },
            options: {
                primaryColor: '#f04',
                spotlightClicks: false,
            }
        },
    },
    {
        target: '.HomeClearButton',
        content: (
            <div className="text-center font-craft">
                <p className="mb-2">🧹 The <strong>Clear All Data</strong> button resets your extension!</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">📝 Clicking will delete all courses, reports, and history information.</p>
                <p className="text-sm text-primary-dark font-craft-demi mb-1">↩️ You'll be redirected to the <strong>Add Course</strong> screen automatically.</p>
                <p className="text-sm text-primary-dark font-craft-demi"><strong>🔄 Perfect for starting a new auto-enrollment session!</strong></p>
            </div>
        ),
        disableBeacon: true,
        styles: {
            spotlight: {
                padding: 0,
                borderRadius: 16,
            },
            options: {
                primaryColor: '#f04',
                spotlightClicks: false,
            }
        },
    }
];

const HomeContainer: React.FC<HomeContainerProps> = observer(({ navigateTo }) => {
    const store = useStore();
    const activeBottomTab = store.persistentRouter.activeBottomTab;
    const setActiveBottomTab = store.persistentRouter.setActiveBottomTab;
    const historyStep = store.history.currentStep;

    // Extract common condition to avoid DRY
    const isBackgroundCompleted = store.history.backgroundStatus === BackgroundStatus.COMPLETED;
    console.log(`background status: ${store.history.backgroundStatus}`);

    // Add a ref to track if we've already fetched coupons
    const hasFetchedCoupons = useRef(false);

    // Joyride states
    const [runBottomBarTour, setRunBottomBarTour] = useState(false);
    const [isJoyrideLoading, setIsJoyrideLoading] = useState(true);
    const [stepIndex, setStepIndex] = useState(0);

    // Fetch coupons when needed
    useEffect(() => {
        // Only fetch coupons if we haven't already and meet one of the conditions
        if (!hasFetchedCoupons.current &&
            (store.persistentRouter.navigationParams.fromScreen === Screen.ADD_COURSE ||
                historyStep === HistoryStep.INITIAL ||
                historyStep === HistoryStep.FIND_COURSE)) {

            store.couponStore.fetchCoupons();
            // Mark that we've fetched coupons
            hasFetchedCoupons.current = true;
        }
    }, [store, store.persistentRouter.navigationParams.fromScreen, historyStep]);

    // Load Joyride tour state
    useEffect(() => {
        const checkTourState = async () => {
            const tourCompleted = await CacheSessionService.get<boolean>(SESSION_CACHE_KEYS.TOUR_BOTTOM_BAR);
            setRunBottomBarTour(!tourCompleted);
            setIsJoyrideLoading(false);
        };

        checkTourState();
    }, []);

    // Handle Joyride callbacks
    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, index, type } = data;

        if (type === 'step:after') {
            // Move to the next step
            setStepIndex(index + 1);
        }

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            // Save tour completion status to cache session
            CacheSessionService.set(SESSION_CACHE_KEYS.TOUR_BOTTOM_BAR, true);
            setRunBottomBarTour(false);
        }
    };

    return (
        <>
            <Home
                activeBottomTab={activeBottomTab}
                setActiveBottomTab={setActiveBottomTab}
                restrictToDefaultTab={!isBackgroundCompleted}
            />

            {!isJoyrideLoading && isBackgroundCompleted && (
                <Joyride
                    run={runBottomBarTour}
                    steps={bottomBarSteps}
                    stepIndex={stepIndex}
                    callback={handleJoyrideCallback}
                    continuous={true}
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
        </>
    );
});

export default HomeContainer; 
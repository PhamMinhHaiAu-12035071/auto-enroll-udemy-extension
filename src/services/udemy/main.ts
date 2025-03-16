import { BackgroundStatus, HistoryState, HistoryStep } from '../../models/HistoryModel';
import { Coupon } from '../../type';
import { CacheSessionService, SESSION_CACHE_KEYS } from '../cache/cache_session_service';
import { NotificationService } from '../notification/notification_service';
import { checkoutCartPage } from './checkout_cart_page';
import { enrollCoursePage } from './enroll_course_page';
import { reportStore } from './report_store';
import { UdemyMessageAction } from './types';
import {
  createTabUrl,
  isCartSuccessUrl,
  isPaymentCheckoutUrl,
  updateTabUrl,
} from './utils';

const handleEnrollCourse = async (
  coupon: Coupon,
  tabId: number,
  courseId: number
) => {
  const cartUrl = `https://www.udemy.com/payment/checkout/express/course/${courseId}/?discountCode=${coupon.couponCode}`;

  await updateTabUrl(tabId, cartUrl);

  await chrome.scripting.executeScript({
    target: { tabId },
    func: checkoutCartPage,
    args: [tabId, coupon],
  });
};

const handleCompleteEnrollCourse = async (
  tabId: number,
  coupon: Coupon
): Promise<boolean> => {
  const tab = await chrome.tabs.get(tabId);

  if (tab.url && isPaymentCheckoutUrl(tab.url)) {
    const startTime = Date.now();
    const MAX_WAIT_TIME = 10_000; // 10 seconds
    const CHECK_INTERVAL = 500; // Check every 500ms

    return new Promise<boolean>((resolve) => {
      const checkSuccess = async () => {
        const currentTab = await chrome.tabs.get(tabId);

        if (!currentTab.url) {
          resolve(false);
          return;
        }

        if (isCartSuccessUrl(currentTab.url)) {
          resolve(true);
          return;
        }

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= MAX_WAIT_TIME) {
          resolve(false);
          return;
        }

        // Continue checking
        setTimeout(checkSuccess, CHECK_INTERVAL);
      };

      // Start checking
      checkSuccess();
    });
  }

  return false;
};


export const main = () => {
  chrome.runtime.onMessage.addListener(
    async (request, sender, sendResponse) => {
      const action = request.action;
      if (action === UdemyMessageAction.CHECK_COURSE) {
        
        const tab = await createTabUrl(`https://www.udemy.com/`);      
        if (!tab?.id) {
          console.error('No tab ID found, exiting.');
          return;
        }

        reportStore.resetReport();
        reportStore.addCoupons(request.coupons as Coupon[]);
        await crawlerCoupon(tab.id);
      }
    }
  );
};

const handleCompleteCrawlCoupon = async (tabId: number) => {
    // Remove current listener to avoid duplicate listeners
    removeUdemyMessageListener();
    
    // Move to the next coupon in the list
    reportStore.incrementCount();
    
    await new Promise(resolve => setTimeout(resolve, 2_000));
    // Process the next coupon recursively
    await crawlerCoupon(tabId);
}

const messageListener = async (request: any, sender: any, sendResponse: any) => {
  const action = request.action;
  if (action === UdemyMessageAction.ENROLL_COURSE) {
    await handleEnrollCourse(request.coupon, request.tabId, request.courseId);
  } else if (action === UdemyMessageAction.COURSE_EXPIRED) {
     reportStore.addBuyNowCourse(request.coupon);
  } else if (action === UdemyMessageAction.GOTO_COURSE) {
     reportStore.addGoToCourse(request.coupon);
  } else if (action === UdemyMessageAction.COMPLETE_ENROLL_COURSE) {
    const isSuccess = await handleCompleteEnrollCourse(
      request.tabId,
      request.coupon
    );

    if (isSuccess) {
      reportStore.addEnrollNowCourse(request.coupon);
      
      // Add notification for successful enrollment
      const notificationService = NotificationService.getInstance();
      await notificationService.createNotification({
        type: 'basic',
        title: 'Course Enrolled Successfully!',
        message: `You have successfully enrolled in:\n${request.coupon.title}`,
        requireInteraction: true,
        buttons: [
          { title: 'View Course' }
        ]
      });
      await handleCompleteCrawlCoupon(request.tabId);
    }
  } else if (action === UdemyMessageAction.COMPLETE_CRAWL_COUPON) {
    await handleCompleteCrawlCoupon(request.tabId);
  }
};

const finishCrawlCoupon = async (tabId: number) => {
  removeUdemyMessageListener();
 
  const historyState: HistoryState = {
    currentStep: HistoryStep.GO_TO_UDEMY,
    backgroundStatus: BackgroundStatus.COMPLETED
  };
  await CacheSessionService.set<HistoryState>(SESSION_CACHE_KEYS.HISTORY_STATE, historyState);

  const report = reportStore.getReport();
  const enrolledCount = report.statistics.enrollNowCount;
  const totalCount = report.coupons.length;
  
  await NotificationService.getInstance().createNotification({
    type: 'basic',
    title: 'Crawl Coupon Completed',
    message: `Successfully enrolled in ${enrolledCount}/${totalCount} courses. Open the extension popup to see full details.`,
    requireInteraction: false,
    buttons: []
  });

  console.log(`Crawl Coupon Completed`);

  // Close the tab after crawling is complete
  try {
    await chrome.tabs.remove(tabId);
    console.log(`Tab ${tabId} closed successfully.`);
  } catch (error) {
    console.error(`Failed to close tab ${tabId}:`, error);
  }
}

const crawlerCoupon = async (tabId: number) => {
  if (reportStore.getReport().count >= reportStore.getReport().coupons.length) {
    await finishCrawlCoupon(tabId);
    return;
  }

  console.log(`Processing coupon ${reportStore.getReport().count + 1}/${reportStore.getReport().coupons.length}`);

  // Add the listener
  chrome.runtime.onMessage.addListener(messageListener);

  const coupon = reportStore.getReport().coupons[reportStore.getReport().count];
  await updateTabUrl(tabId, coupon.link);

  await chrome.scripting.executeScript({
    target: { tabId },
    func: enrollCoursePage,
    args: [tabId, coupon], // Pass the current index and all coupons
  });
};

// Function to remove the listener when needed
const removeUdemyMessageListener = () => {
  chrome.runtime.onMessage.removeListener(messageListener);
};

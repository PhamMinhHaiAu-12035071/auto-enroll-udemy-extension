import { checkoutCartPage } from './checkout_cart_page';
import { enrollCoursePage } from './enroll_course_page';
import { Coupon, UdemyMessageAction } from './types';
import {
  createTabUrl,
  isCartSuccessUrl,
  updateTabUrl,
  isPaymentCheckoutUrl,
} from './utils';
import { reportStore } from './report_store';

const handleEnrollCourse = async (
  coupon: Coupon,
  tabId: number,
  courseId: number
) => {
  console.log('Đã nhận được message đăng ký khóa học');
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
      if (request.action === 'OPEN_SITE_UDEMY') {
        const tab = await createTabUrl(request.url);

        if (!tab.id) {
          return;
        }

        await updateTabUrl(tab.id, request.url);

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: enrollCoursePage,
          args: [tab.id, request.coupon],
        });
      }

      if (request.action === UdemyMessageAction.ENROLL_COURSE) {
        handleEnrollCourse(request.coupon, request.tabId, request.courseId);
      }

      if (request.action === UdemyMessageAction.COURSE_EXPIRED) {
        reportStore.addBuyNowCourse(request.coupon);
      }

      if (request.action === UdemyMessageAction.GOTO_COURSE) {
        reportStore.addGoToCourse(request.coupon);
      }

      if (request.action === UdemyMessageAction.COMPLETE_ENROLL_COURSE) {
        const isSuccess = await handleCompleteEnrollCourse(
          request.tabId,
          request.coupon
        );

        if (isSuccess) {
          reportStore.addEnrollNowCourse(request.coupon, request.price);
        }
      }
    }
  );
};


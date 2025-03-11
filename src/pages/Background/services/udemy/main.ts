import { checkoutCartPage } from './checkout_cart_page';
import { enrollCoursePage } from './enroll_course_page';
import { Coupon, Price, UdemyMessageAction } from './types';
import {
  createTabUrl,
  isCartSuccessUrl,
  updateTabUrl,
  isPaymentCheckoutUrl,
} from './utils';
import { reportStore } from './report_store';

const mockDataEnroll = {
  title: 'Mind Power - Change Your Thought Process To Change Your Life',
  link: 'https://www.udemy.com/course/master-the-power-of-your-mind-to-be-more-successful/?couponCode=MAR2025FREE1',
  couponCode: 'MAR2025FREE1',
  isExpired: true,
  checkTime: '2025-03-10T07:40:22.506Z',
  rating: 4.3,
  authors: ['Susmita Dutta', 'Ash Akshay Goel'],
  enrollStudents: 104519,
  language: 'English',
  topics: [
    'Personal Development',
    'Personal Transformation',
    'Personal Success',
  ],
};

const mockDataCourseExpired = {
  title: 'Learn PHP and MySQL for Web Application and Web Development',
  link: 'https://www.udemy.com/course/learn-php-and-mysql-for-web-application-and-web-development/?couponCode=A6A4A40BE4B2AA3CD667',
  couponCode: 'A6A4A40BE4B2AA3CD667',
  isExpired: true,
  checkTime: '2025-03-09T11:52:54.246Z',
  rating: 4.4,
  authors: ['Marcus Menti', 'Zechariah Tech'],
  enrollStudents: 49126,
  language: 'English',
  topics: ['Development', 'Web Development', 'PHP (programming language)'],
};

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

        await updateTabUrl(tab.id, mockDataEnroll.link);

        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: enrollCoursePage,
          args: [tab.id, mockDataEnroll],
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

setTimeout(() => {
  console.log('print report store');
  console.log(reportStore.getReport());
}, 30_000);

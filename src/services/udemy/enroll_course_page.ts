import {
  ButtonStatus,
  CompleteCrawlCouponMessage,
  CourseExpiredMessage,
  EnrollCourseMessage,
  GotoCourseMessage,
  UdemyNetworkResource,
} from './types';
import { Coupon } from '../../type';
export const enrollCoursePage = (tabId: number, coupon: Coupon) => {
  const TIMEOUT = 2_000;

  /// send message course expired
  const sendCourseExpiredMessage = (coupon: Coupon) => {
    const message: CourseExpiredMessage = {
      action: 'COURSE_EXPIRED',
      coupon: coupon,
    };
    chrome.runtime.sendMessage(message);
  };

  /// send message enroll course
  const sendEnrollCourseMessage = (
    coupon: Coupon,
    tabId: number,
    courseId: number
  ) => {
    const message: EnrollCourseMessage = {
      action: 'ENROLL_COURSE',
      coupon: coupon,
      tabId: tabId,
      courseId: courseId,
    };
    chrome.runtime.sendMessage(message);
  };

  const sendGotoCourseMessage = (coupon: Coupon) => {
    const message: GotoCourseMessage = {
      action: 'GOTO_COURSE',
      coupon: coupon,
    };
    chrome.runtime.sendMessage(message);
  };

  const sendCompleteCrawlCouponMessage = (coupon: Coupon, tabId: number) => {
    const message: CompleteCrawlCouponMessage = {
      action: 'COMPLETE_CRAWL_COUPON',
      coupon: coupon,
      tabId: tabId,
    };
    chrome.runtime.sendMessage(message);
  };
  // Function xử lý dựa vào text button được trả về
  const setupButtonObserverAndHandleExpired = (
    tabId: number,
    courseId: number
  ) => {
    const observer = new MutationObserver(() => {
      const buttonStatus = getEnrollButtonStatus();
      if (buttonStatus.isReady) {
        if (
          buttonStatus.buttonText &&
          isEnrollNowButton(buttonStatus.buttonText)
        ) {
          sendEnrollCourseMessage(coupon, tabId, courseId);
        } else if (
          buttonStatus.buttonText &&
          isGotoCourseButton(buttonStatus.buttonText)
        ) {
          sendGotoCourseMessage(coupon);
          sendCompleteCrawlCouponMessage(coupon, tabId);
        } else {
          sendCourseExpiredMessage(coupon);
          sendCompleteCrawlCouponMessage(coupon, tabId);
        }
        observer.disconnect();
      }
    });

    // Cấu hình observer
    const config = {
      childList: true, // theo dõi thay đổi con
      subtree: true, // theo dõi tất cả các node con
      attributes: true, // theo dõi thay đổi thuộc tính
    };

    // Bắt đầu theo dõi toàn bộ document
    observer.observe(document.body, config);
  };

  // Function kiểm tra trạng thái của button với kiểu trả về được định nghĩa
  const getEnrollButtonStatus = (): ButtonStatus => {
    const buttons = document.querySelectorAll(
      'button[type="button"][data-purpose="buy-this-course-button"]'
    );
    if (buttons.length > 0) {
      const enrollButton = buttons[1];
      const isSkeleton =
        enrollButton.closest('[data-purpose="skeleton"]') !== null;

      if (!isSkeleton) {
        const buttonText = enrollButton.textContent ?? undefined;
        return {
          isReady: true,
          buttonText: buttonText,
        };
      }
    }
    return { isReady: false };
  };

  // Function kiểm tra xem button có phải là "Enroll Now" không
  const isEnrollNowButton = (buttonText: string | undefined): boolean => {
    return buttonText?.toLowerCase().trim() === 'enroll now';
  };

  const isGotoCourseButton = (buttonText: string | undefined): boolean => {
    return buttonText?.toLowerCase().trim() === 'go to course';
  };

  const setupNetworkListener = (): void => {
    const MAX_RETRIES = 5; // Số lần thử tối đa
    let retryCount = 0;

    // Lắng nghe sự kiện resource timing buffer đầy
    const bufferFullListener = () => {
      performance.clearResourceTimings();
    };

    performance.addEventListener(
      'resourcetimingbufferfull',
      bufferFullListener
    );

    // Kiểm tra network request định kỳ
    const checkInterval = setInterval(() => {
      retryCount++;
      const requests = captureNetworkRequest();

      // Kiểm tra nếu đã vượt quá số lần thử
      if (retryCount >= MAX_RETRIES) {
        clearInterval(checkInterval);
        performance.removeEventListener(
          'resourcetimingbufferfull',
          bufferFullListener
        );
        // Gửi thông báo thất bại
        chrome.runtime.sendMessage({
          action: 'COURSE_CHECK_FAILED',
          message: 'Failed to find course ID after maximum retries',
        });
        return;
      }

      if (requests.length > 0) {
        for (const url of requests) {
          if (isUdemyCourseApiUrl(url)) {
            const courseId = extractCourseIdFromUrl(url);
            if (courseId) {
              setupButtonObserverAndHandleExpired(tabId, Number(courseId));
              clearInterval(checkInterval);
              performance.removeEventListener(
                'resourcetimingbufferfull',
                bufferFullListener
              );
              return;
            }
          }
        }
      }
    }, TIMEOUT);
  };

  const captureNetworkRequest = (): string[] => {
    const captureNetworkRequest: string[] = [];
    const captureResource = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[];

    for (const resource of captureResource) {
      const networkResource: UdemyNetworkResource = {
        name: resource.name,
        initiatorType: resource.initiatorType,
      };

      // Chỉ lọc các request XHR, bỏ qua image, script và media khác
      if (networkResource.initiatorType === 'xmlhttprequest') {
        // Lọc URL của Udemy
        if (networkResource.name.indexOf('udemy.com') > -1) {
          captureNetworkRequest.push(networkResource.name);
        }
      }
    }

    return captureNetworkRequest;
  };

  // Function trích xuất course ID từ URL
  const extractCourseIdFromUrl = (url: string): string | null => {
    // Regex để trích xuất course ID từ URL
    const courseIdRegex = /\/api-2\.0\/courses\/(\d+)\//;
    const match = courseIdRegex.exec(url);

    // Trả về course ID nếu tìm thấy, ngược lại trả về null
    return match ? match[1] : null;
  };

  // Function kiểm tra xem URL có phải là API course của Udemy không
  const isUdemyCourseApiUrl = (url: string): boolean => {
    const courseApiRegex =
      /https:\/\/www\.udemy\.com\/api-2\.0\/courses\/\d+\//;
    return courseApiRegex.test(url);
  };

  // Khởi tạo ban đầu
  setupNetworkListener();
};

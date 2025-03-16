import { Coupon } from '../../type';
import {
  ButtonStatus,
  CompleteEnrollCourseMessage
} from './types';

export const checkoutCartPage = (tabId: number, coupon: Coupon) => {
  /// send message enroll course
  const sendCompleteEnrollCourseMessage = (
    tabId: number,
    coupon: Coupon,
  ) => {
    const message: CompleteEnrollCourseMessage = {
      action: 'COMPLETE_ENROLL_COURSE',
      coupon: coupon,
      tabId: tabId,
    };
    chrome.runtime.sendMessage(message);
  };


  // Kiểm tra xem trang có đang hiển thị skeleton loading không
  const isSkeletonLoading = (): boolean => {
    // Kiểm tra các phần tử skeleton trong trang
    const skeletonElements = document.querySelectorAll(
      '[data-purpose="skeleton"]'
    );
    return skeletonElements.length > 0;
  };

  const clickEnrollButton = () => {
    const enrollButton = document.querySelector(
      `section[data-purpose="pricing-summary-container"] + div button[type="button"]`
    );
    if (!enrollButton) {
      return;
    }
    (enrollButton as HTMLButtonElement).click();
  };

  // Function xử lý dựa vào text button được trả về
  const setupButtonObserver = () => {
    // Đặt timeout để tránh hiển thị spinner quá nhanh
    const SKELETON_CHECK_DELAY = 750; // ms
    let isInitialCheck = true;
    let wasInSkeletonState = true;
    let hasMessageSent = false; // Thêm flag để theo dõi việc gửi tin nhắn

    const observer = new MutationObserver(() => {
      const currentSkeletonState = isSkeletonLoading();

      // Nếu đang trong skeleton loading state, chờ đợi
      if (currentSkeletonState) {
        console.info('Trang đang trong trạng thái skeleton loading');
        wasInSkeletonState = true;
        return;
      }

      // Nếu vừa thoát khỏi trạng thái skeleton, đợi thêm một chút
      if (wasInSkeletonState) {
        wasInSkeletonState = false;
        setTimeout(() => checkButtonStatus(), SKELETON_CHECK_DELAY);
        return;
      }

      // Nếu là lần kiểm tra đầu tiên, đợi một chút để tránh blink
      if (isInitialCheck) {
        isInitialCheck = false;
        setTimeout(() => checkButtonStatus(), SKELETON_CHECK_DELAY);
        return;
      }

      checkButtonStatus();
    });

    const checkButtonStatus = () => {
      // Nếu đã gửi tin nhắn rồi thì không làm gì cả
      if (hasMessageSent) {
        observer.disconnect();
        return;
      }

      const buttonStatus = getEnrollButtonStatus();

      if (
        buttonStatus.isReady &&
        buttonStatus.buttonText &&
        isEnrollNowButton(buttonStatus.buttonText)
      ) {
        clickEnrollButton();
        sendCompleteEnrollCourseMessage(tabId, coupon);
        hasMessageSent = true;
        observer.disconnect();
      }
    };

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
    // Tìm nút "Enroll now" dựa trên data-purpose selector
    const buttons = document.querySelectorAll(
      `section[data-purpose="pricing-summary-container"] + div button[type="button"]`
    );

    // Kiểm tra xem có buttons không
    if (buttons.length === 0) {
      return { isReady: false };
    }

    // Lấy button cuối cùng (thường là nút Enroll)
    const enrollButton = buttons[buttons.length - 1];

    // Kiểm tra xem button có đang trong skeleton state không
    const isSkeleton =
      enrollButton.closest('[data-purpose="skeleton"]') !== null;
    if (isSkeleton) {
      return { isReady: false };
    }

    const buttonText = enrollButton.textContent?.trim() ?? undefined;
    const isEnrollNow = isEnrollNowButton(buttonText);

    // Chỉ trả về isReady: true khi button text là "Enroll now"
    return {
      isReady: isEnrollNow, // Chỉ ready khi là "Enroll now"
      buttonText: buttonText,
    };
  };

  // Function kiểm tra xem button có phải là "Enroll Now" không
  const isEnrollNowButton = (buttonText: string | undefined): boolean => {
    if (!buttonText) return false;
    // Kiểm tra cả "Enroll now" và các biến thể khác
    const lowerText = buttonText.toLowerCase().trim();
    return lowerText === 'enroll now';
  };

  // Khởi tạo ban đầu
  setupButtonObserver();
};

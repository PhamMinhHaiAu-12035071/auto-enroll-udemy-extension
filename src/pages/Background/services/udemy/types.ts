// Define interface cho network resource
export interface UdemyNetworkResource {
  name: string;
  initiatorType: string;
}

// Define interface cho button status
export interface ButtonStatus {
  isReady: boolean;
  buttonText?: string;
}

// Define interface cho message gửi về background
export interface CourseIdFoundMessage {
  action: 'COURSE_ID_FOUND';
  courseId: string;
  tabId: number;
}

// Define interface cho message khi khóa học hết hạn
export interface CourseExpiredMessage {
  action: 'COURSE_EXPIRED';
  coupon: Coupon;
}

export interface EnrollCourseMessage {
  action: 'ENROLL_COURSE';
  coupon: Coupon;
  tabId: number;
  courseId: number;
}

export interface CompleteEnrollCourseMessage {
  action: 'COMPLETE_ENROLL_COURSE';
  coupon: Coupon;
  price: Price;
  tabId: number;
}

export interface GotoCourseMessage {
  action: 'GOTO_COURSE';
  coupon: Coupon;
}

// Define enum for all UdemyMessage actions
export enum UdemyMessageAction {
  COURSE_EXPIRED = 'COURSE_EXPIRED',
  ENROLL_COURSE = 'ENROLL_COURSE',
  COMPLETE_ENROLL_COURSE = 'COMPLETE_ENROLL_COURSE',
  COURSE_ID_FOUND = 'COURSE_ID_FOUND',
  GOTO_COURSE = 'GOTO_COURSE',
}

// Define union type cho tất cả các loại message có thể gửi
export type UdemyMessage =
  | CourseExpiredMessage
  | EnrollCourseMessage
  | CompleteEnrollCourseMessage
  | GotoCourseMessage;

// Define interface cho mock data
export interface Coupon {
  title: string;
  link: string;
  couponCode: string;
  isExpired: boolean;
  checkTime: string;
  rating: number;
  authors: string[];
  enrollStudents: number;
  language: string;
  topics: string[];
}

export type Price = {
  value: number;
  currency: string;
};

// Define enum cho các trạng thái của khóa học
export enum CourseEnrollStatus {
  BUY_NOW = 'buy_now', // Hết hạn khuyến mãi
  GO_TO_COURSE = 'go_to_course', // Đã đăng ký
  ENROLL_NOW = 'enroll_now', // Còn hạn, có thể enroll
}

// Interface cho một khoá học đã enroll với thông tin chi tiết
export interface EnrolledCourseDetail {
  coupon: Coupon;
  status: CourseEnrollStatus;
  originalPrice?: Price; // Giá gốc (nếu status là ENROLL_NOW)
}

// Interface cho báo cáo tổng hợp
export interface EnrollmentReport {
  // Thống kê số lượng theo từng trạng thái
  statistics: {
    buyNowCount: number; // Số lượng khoá học hết hạn
    goToCourseCount: number; // Số lượng khoá học đã đăng ký
    enrollNowCount: number; // Số lượng khoá học có thể enroll
  };

  // Chi tiết tiết kiệm
  savings: {
    totalOriginalPrice: number; // Tổng giá gốc của các khoá học đã enroll
    currency: string; // Đơn vị tiền tệ
  };

  // Danh sách chi tiết các khoá học theo từng trạng thái
  details: {
    buyNow: EnrolledCourseDetail[];
    goToCourse: EnrolledCourseDetail[];
    enrollNow: EnrolledCourseDetail[];
  };
}

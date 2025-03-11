import {
  CourseEnrollStatus,
  EnrolledCourseDetail,
  EnrollmentReport,
  Coupon,
  Price,
} from './types';

class ReportStore {
  private static instance: ReportStore;
  private report: EnrollmentReport;

  private constructor() {
    // Khởi tạo report trống
    this.report = {
      statistics: {
        buyNowCount: 0,
        goToCourseCount: 0,
        enrollNowCount: 0,
      },
      savings: {
        totalOriginalPrice: 0,
        currency: 'VND',
      },
      details: {
        buyNow: [],
        goToCourse: [],
        enrollNow: [],
      },
    };
  }

  public static getInstance(): ReportStore {
    if (!ReportStore.instance) {
      ReportStore.instance = new ReportStore();
    }
    return ReportStore.instance;
  }

  // Thêm khoá học đã hết hạn
  public addBuyNowCourse(coupon: Coupon): void {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.BUY_NOW,
    };

    this.report.statistics.buyNowCount++;
    this.report.details.buyNow.push(courseDetail);
  }

  // Thêm khoá học đã đăng ký
  public addGoToCourse(coupon: Coupon): void {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.GO_TO_COURSE,
    };

    this.report.statistics.goToCourseCount++;
    this.report.details.goToCourse.push(courseDetail);
  }

  // Thêm khoá học có thể enroll
  public addEnrollNowCourse(coupon: Coupon, originalPrice: Price): void {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.ENROLL_NOW,
      originalPrice,
    };

    this.report.statistics.enrollNowCount++;
    this.report.details.enrollNow.push(courseDetail);

    // Cập nhật tổng tiền tiết kiệm
    this.report.savings.totalOriginalPrice += originalPrice.value;
    this.report.savings.currency = originalPrice.currency;
  }

  // Lấy toàn bộ report
  public getReport(): EnrollmentReport {
    return { ...this.report };
  }

  // Reset report
  public resetReport(): void {
    this.report = {
      statistics: {
        buyNowCount: 0,
        goToCourseCount: 0,
        enrollNowCount: 0,
      },
      savings: {
        totalOriginalPrice: 0,
        currency: 'USD',
      },
      details: {
        buyNow: [],
        goToCourse: [],
        enrollNow: [],
      },
    };
  }
}

export const reportStore = ReportStore.getInstance();

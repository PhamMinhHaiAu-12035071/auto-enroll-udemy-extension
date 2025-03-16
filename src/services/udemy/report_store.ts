import {
  CourseEnrollStatus,
  EnrolledCourseDetail,
  EnrollmentReport,
} from './types';
import { Coupon } from '../../type';
class ReportStore {
  private static instance: ReportStore;
  private report: EnrollmentReport;

  private constructor() {
    // Khởi tạo report trống
    this.report = {
      count: 0,
      coupons: [],
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

  public incrementCount(): void {
    this.report.count++;
  }

  public addCoupons(coupons: Coupon[]): void {
    this.report.coupons = coupons;
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
  public addEnrollNowCourse(coupon: Coupon): void {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.ENROLL_NOW,
    };

    this.report.statistics.enrollNowCount++;
    this.report.details.enrollNow.push(courseDetail);

    // Cập nhật tổng tiền tiết kiệm
    this.report.savings.totalOriginalPrice += coupon.price ?? 0;
    this.report.savings.currency = 'VND';
  }

  // Lấy toàn bộ report
  public getReport(): EnrollmentReport {
    return { ...this.report };
  }

  // Reset report
  public resetReport(): void {
    this.report = {
      count: 0,
      coupons: [],
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

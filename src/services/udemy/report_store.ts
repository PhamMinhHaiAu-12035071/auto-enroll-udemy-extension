import {
  CourseEnrollStatus,
  EnrolledCourseDetail,
  EnrollmentReport,
} from './types';
import { Coupon } from '../../type';
import { CacheSessionService, SESSION_CACHE_KEYS } from '../cache/cache_session_service';

// Tạo cache key riêng cho report data
const REPORT_CACHE_KEY = SESSION_CACHE_KEYS.REPORT_DATA

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

    // Try to load from cache immediately
    this.loadFromCache();
  }

  public static getInstance(): ReportStore {
    if (!ReportStore.instance) {
      ReportStore.instance = new ReportStore();
    }
    return ReportStore.instance;
  }

  /**
   * Load report data from cache session
   */
  private async loadFromCache(): Promise<void> {
    try {
      const cachedReport = await CacheSessionService.get<EnrollmentReport>(REPORT_CACHE_KEY);
      if (cachedReport) {
        this.report = cachedReport;
        console.log('Loaded report data from cache session');
      }
    } catch (error) {
      console.error('Failed to load report from cache', error);
    }
  }

  /**
   * Save current report data to cache session
   */
  private async saveToCache(): Promise<void> {
    try {
      await CacheSessionService.set(REPORT_CACHE_KEY, this.report);
    } catch (error) {
      console.error('Failed to save report to cache', error);
    }
  }

  public async incrementCount(): Promise<void> {
    this.report.count++;
    await this.saveToCache();
  }

  public async addCoupons(coupons: Coupon[]): Promise<void> {
    this.report.coupons = coupons;
    await this.saveToCache();
  }

  // Thêm khoá học đã hết hạn
  public async addBuyNowCourse(coupon: Coupon): Promise<void> {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.BUY_NOW,
    };

    this.report.statistics.buyNowCount++;
    this.report.details.buyNow.push(courseDetail);
    await this.saveToCache();
  }

  // Thêm khoá học đã đăng ký
  public async addGoToCourse(coupon: Coupon): Promise<void> {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.GO_TO_COURSE,
    };

    this.report.statistics.goToCourseCount++;
    this.report.details.goToCourse.push(courseDetail);
    await this.saveToCache();
  }

  // Thêm khoá học có thể enroll
  public async addEnrollNowCourse(coupon: Coupon): Promise<void> {
    const courseDetail: EnrolledCourseDetail = {
      coupon,
      status: CourseEnrollStatus.ENROLL_NOW,
    };

    this.report.statistics.enrollNowCount++;
    this.report.details.enrollNow.push(courseDetail);

    // Cập nhật tổng tiền tiết kiệm
    this.report.savings.totalOriginalPrice += coupon.price ?? 0;
    this.report.savings.currency = 'VND';
    
    await this.saveToCache();
  }

  // Lấy toàn bộ report
  public getReport(): EnrollmentReport {
    return { ...this.report };
  }

  // Reset report
  public async resetReport(): Promise<void> {
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
    
    // Xóa dữ liệu trong cache
    await CacheSessionService.remove(REPORT_CACHE_KEY);
  }
}

export const reportStore = ReportStore.getInstance();

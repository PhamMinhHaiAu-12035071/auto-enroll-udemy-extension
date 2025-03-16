import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { RowCoupon } from '../../type';

const SUPABASE_URL = 'https://ggmuhijchpcrlbhfkjah.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdnbXVoaWpjaHBjcmxiaGZramFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDA4NDMsImV4cCI6MjA1NzI3Njg0M30.VL-dwBIAMCMIeceiX76uK1bgW4CmY37MQ1atrguFl0U'
const SUPABASE_TABLE_NAME = 'UdemyPaidCourse'

/**
 * Service quản lý kết nối và truy vấn dữ liệu từ Supabase
 */
export class SupabaseService {
  private static instance: SupabaseService;
  private readonly client: SupabaseClient;
  private readonly tableName: string = SUPABASE_TABLE_NAME;
  private readonly maxLimit: number = 1000; // Supabase có giới hạn mặc định là 1000 phần tử mỗi truy vấn

  /**
   * Constructor riêng tư để đảm bảo Singleton pattern
   */
  private constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  /**
   * Lấy instance của SupabaseService (Singleton pattern)
   */
  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  /**
   * Lấy tất cả coupons từ Supabase
   * @returns Tất cả dữ liệu coupons
   */
  public async getAllCoupons() {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Lấy số lượng tối đa phần tử mà Supabase có thể trả về trong một lần truy vấn
   * @returns Số lượng phần tử tối đa
   */
  public getMaxLimit(): number {
    return this.maxLimit;
  }

  /**
   * Lấy tổng số phần tử trong bảng
   * @returns Tổng số phần tử
   */
  public async getTotalCouponsCount(): Promise<number> {
    const { count, error } = await this.client
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting total count:', error);
      throw error;
    }

    return count ?? 0;
  }

  /**
   * Kiểm tra xem số lượng phần tử có vượt quá giới hạn của Supabase không
   * @returns True nếu số lượng phần tử vượt quá giới hạn
   */
  public async isExceedingLimit(): Promise<boolean> {
    const totalCount = await this.getTotalCouponsCount();
    return totalCount > this.maxLimit;
  }


  /**
   * Lấy dữ liệu với số lượng tối đa mà Supabase cho phép
   * @returns Dữ liệu trong giới hạn của Supabase
   */
  public async getCouponsWithinLimit() {
    const { data, error } = await this.client
      .from(this.tableName)
      .select('*')
      .limit(this.maxLimit);

    if (error) {
      throw error;
    }

    return data;
  }
}

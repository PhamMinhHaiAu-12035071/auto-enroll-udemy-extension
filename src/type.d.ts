export type Coupon = {
    id: string
    title: string
    link: string
    couponCode: string
    checkTime: Date | string
    rating: number | null
    authors: Array<string>
    enrollStudents: number | null
    language: string | null
    topics: string[]
    price: number | null
    duration: number | null
    image: { src: string; srcset: string[]; width?: number; height?: number } | null
    amountRating: number | null
}

export type RowCoupon = {
    id: number;
    coupon: Coupon;
}